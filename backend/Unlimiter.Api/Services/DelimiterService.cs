using Unlimiter.Api.Models;

namespace Unlimiter.Api.Services;

public class DelimiterService : IDelimiterService
{
    private static readonly Dictionary<string, string> DelimiterNames = new()
    {
        { ",", "Comma" },
        { " ", "Space" },
        { "\t", "Tab" },
        { ";", "Semicolon" }
    };

    // Priority order: tab > semicolon > comma > space
    private static readonly string[] Candidates = ["\t", ";", ",", " "];

    public DetectResponse Detect(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return new DetectResponse(",", "Comma");

        var lines = NormalizeAndSplit(text);
        var sampleLines = lines.Where(l => l.Length > 0).Take(20).ToArray();

        if (sampleLines.Length == 0)
            return new DetectResponse(",", "Comma");

        string bestDelimiter = ",";
        double bestScore = -1;

        foreach (var candidate in Candidates)
        {
            var counts = sampleLines.Select(line => CountDelimiter(line, candidate)).ToArray();

            if (counts.All(c => c == 0))
                continue;

            double avg = counts.Average();
            double variance = counts.Select(c => Math.Pow(c - avg, 2)).Average();
            double score = avg / (1 + variance);

            if (score > bestScore)
            {
                bestScore = score;
                bestDelimiter = candidate;
            }
        }

        return new DetectResponse(bestDelimiter, DelimiterNames.GetValueOrDefault(bestDelimiter, "Unknown"));
    }

    public ConvertResponse Convert(string text, string fromDelimiter, string toDelimiter, int[]? columnOrder)
    {
        var lines = NormalizeAndSplit(text);
        var parsedRows = lines.Select(line => SplitRespectingQuotes(line, fromDelimiter)).ToList();

        // Apply column reorder
        if (columnOrder is { Length: > 0 })
        {
            parsedRows = parsedRows.Select(row => ReorderColumns(row, columnOrder)).ToList();
        }

        var headers = parsedRows.Count > 0 ? parsedRows[0] : [];
        var dataRows = parsedRows.Count > 1 ? parsedRows.Skip(1).ToArray() : [];

        var convertedLines = parsedRows.Select(row => string.Join(toDelimiter, row));
        var convertedText = string.Join("\n", convertedLines);

        return new ConvertResponse(convertedText, dataRows, headers);
    }

    private static string[] NormalizeAndSplit(string text)
    {
        return text.Replace("\r\n", "\n").Replace("\r", "\n").Split('\n');
    }

    private static int CountDelimiter(string line, string delimiter)
    {
        bool inQuotes = false;
        int count = 0;

        for (int i = 0; i < line.Length; i++)
        {
            if (line[i] == '"')
            {
                inQuotes = !inQuotes;
            }
            else if (!inQuotes && line.AsSpan(i).StartsWith(delimiter))
            {
                count++;
                i += delimiter.Length - 1;
            }
        }

        return count;
    }

    private static string[] SplitRespectingQuotes(string line, string delimiter)
    {
        if (string.IsNullOrEmpty(line))
            return [line];

        var fields = new List<string>();
        bool inQuotes = false;
        int fieldStart = 0;

        for (int i = 0; i < line.Length; i++)
        {
            if (line[i] == '"')
            {
                inQuotes = !inQuotes;
            }
            else if (!inQuotes && line.AsSpan(i).StartsWith(delimiter))
            {
                fields.Add(line[fieldStart..i]);
                i += delimiter.Length - 1;
                fieldStart = i + 1;
            }
        }

        fields.Add(line[fieldStart..]);
        return fields.ToArray();
    }

    private static string[] ReorderColumns(string[] row, int[] columnOrder)
    {
        return columnOrder.Select(i => i < row.Length ? row[i] : "").ToArray();
    }
}

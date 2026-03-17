namespace Unlimiter.Api.Models;

public record ConvertRequest(string Text, string FromDelimiter, string ToDelimiter, int[]? ColumnOrder);

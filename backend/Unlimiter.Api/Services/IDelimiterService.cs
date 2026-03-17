using Unlimiter.Api.Models;

namespace Unlimiter.Api.Services;

public interface IDelimiterService
{
    DetectResponse Detect(string text);
    ConvertResponse Convert(string text, string fromDelimiter, string toDelimiter, int[]? columnOrder);
}

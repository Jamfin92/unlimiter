using Microsoft.AspNetCore.Mvc;
using Unlimiter.Api.Models;
using Unlimiter.Api.Services;

namespace Unlimiter.Api.Controllers;

[ApiController]
[Route("api/delimiter")]
public class DelimiterController(IDelimiterService delimiterService) : ControllerBase
{
    [HttpPost("detect")]
    public ActionResult<DetectResponse> Detect([FromBody] DetectRequest request)
    {
        if (string.IsNullOrEmpty(request.Text))
            return BadRequest("Text is required");

        var result = delimiterService.Detect(request.Text);
        return Ok(result);
    }

    [HttpPost("convert")]
    public ActionResult<ConvertResponse> Convert([FromBody] ConvertRequest request)
    {
        if (string.IsNullOrEmpty(request.Text))
            return BadRequest("Text is required");

        var result = delimiterService.Convert(
            request.Text,
            request.FromDelimiter,
            request.ToDelimiter,
            request.ColumnOrder);
        return Ok(result);
    }
}

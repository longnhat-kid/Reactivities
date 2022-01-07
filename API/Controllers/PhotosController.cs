using Application.Photos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class PhotosController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> Add([FromForm] IFormFile file)
        {
            var result = await Mediator.Send(new Add.Command { File = file });
            return HandleResult(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            var result = await Mediator.Send(new Delete.Command { Id = id });
            return HandleResult(result);
        }

        [HttpPut("main/{id}")]
        public async Task<IActionResult> SetMain(string id)
        {
            var result = await Mediator.Send(new SetMain.Command { Id = id });
            return HandleResult(result);
        }
    }
}

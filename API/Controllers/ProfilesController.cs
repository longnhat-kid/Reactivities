using Application.Photos;
using Application.Profiles;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetProfiles (string userName)
        {
            var result = await Mediator.Send(new Details.Query { UserName = userName });
            return HandleResult(result);
        }

        [HttpGet("{userName}/activities")]
        public async Task<IActionResult> GetUserActivities(string userName, string predicate)
        {
            var result = await Mediator.Send(new Event.Query { UserName = userName, Predicate = predicate });
            return HandleResult(result);
        }
    }
}

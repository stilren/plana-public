using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using web.Models;
using web.Services;

namespace web.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;

        public AssignmentController(IAssignmentService assignmentService)
        {
            _assignmentService = assignmentService;
        }

        // POST api/assignment
        [HttpPost]
        public ActionResult<Solution> Post([FromBody] ProblemStatement problem)
        {
            var (solution, _) = _assignmentService.Solve(problem);
            return new OkObjectResult(solution);
        }

        // GET api/assignment
        [HttpGet]
        public ActionResult<IEnumerable<string>> Get()
        {
            return new string[] { "Im up!" };
        }
    }
}
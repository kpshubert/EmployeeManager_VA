using EmployeeManager_VA.Server.Data;
using EmployeeManager_VA.Server.Models;
using EmployeeManager_VA.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManager_VA.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class DepartmentController(ILogger<DepartmentController> logger, EmployeeManagerDbContext employeeManagerDbContext) : ControllerBase
    {
        private readonly ILogger<DepartmentController> _logger = logger;

        [HttpGet(Name = "GetDepartment")]
        public async Task<IEnumerable<DepartmentViewModel>> Get(int? id, string? mode, string? filter)
        {
            var departments = new List<TEmDepartment>();
            var returnValue = new List<DepartmentViewModel>();

            if (id != null && id != 0)
            {
                departments = [.. employeeManagerDbContext.TEmDepartments.Where(d => d.Id == id)];
            }
            else
            {
                if (mode != null && mode.ToLower() == "list")
                {
                    departments = [.. employeeManagerDbContext.TEmDepartments];
                }
            }

            if (departments.Count > 0)
            {
                foreach (var department in departments)
                {
                    var newDeparment = new DepartmentViewModel();

                    Utilities.Utilities.CopySharedPropertyValues<TEmDepartment, DepartmentViewModel>(department, newDeparment);

                    returnValue.Add(newDeparment);
                }
            }
            else
            {
                returnValue.Add(new DepartmentViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostDepartment")]
        public IActionResult Post([FromBody] DepartmentViewModel departmentViewModel)
        {
            return Ok("Received");
        }
    }
}

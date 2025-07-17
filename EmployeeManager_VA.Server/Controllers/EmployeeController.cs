using EmployeeManager_VA.Server.Data;
using EmployeeManager_VA.Server.Models;
using EmployeeManager_VA.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;
using System.Diagnostics.Eventing.Reader;

namespace EmployeeManager_VA.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class EmployeeController(ILogger<EmployeeController> logger, EmployeeManagerDbContext employeeManagerDbContext) : ControllerBase
    {
        private readonly ILogger<EmployeeController> _logger = logger;

        [HttpGet(Name = "GetEmployee")]
        public IEnumerable<EmployeeViewModel> Get(int? id, string? mode, string? filter)
        {
            var employees = new List<TEmEmployee>();
            var departmentsDictionary = Utilities.ApplicationUtilities.GetDepartments(employeeManagerDbContext);
            var returnValue = new List<EmployeeViewModel>();

            if (id != null && id != 0)
            {
                employees = [.. employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department).Where(e => e.Id == id)];
            }
            else
            {
                if (mode != null && mode.ToLower() == "list")
                {
                    employees = [.. employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department)];
                }
            }

            if (employees.Count > 0)
            {
                foreach (var employee in employees)
                {
                    var newEmployeeViewModel = new EmployeeViewModel();

                    Utilities.Utilities.CopySharedPropertyValues<TEmEmployee, EmployeeViewModel>(employee, newEmployeeViewModel);

                    if (employee.Department != null && employee.Department.Name != null)
                    {
                        newEmployeeViewModel.DepartmentName = employee.Department.Name;
                    }

                    returnValue.Add(newEmployeeViewModel);
                }
            }
            else
            {
                returnValue.Add(new EmployeeViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostEmployee")]
        public IActionResult Post([FromBody] EmployeeViewModel employeeViewModel)
        {
            return Ok("Received");
        }
    }
}

using EmployeeManager_VA.Server.Data;
using EmployeeManager_VA.Server.Models;
using EmployeeManager_VA.Server.ViewModels;
using Humanizer;
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
                    newEmployeeViewModel.DepartmentId = employee.DepartmentId;
                    newEmployeeViewModel.DepartmentIdString = newEmployeeViewModel.DepartmentId.ToString();

                    if (employee.Department != null && employee.Department.Name != null)
                    {
                        newEmployeeViewModel.DepartmentName = employee.Department.Name;
                        if (mode != "list")
                        {
                            newEmployeeViewModel.FormMode = "edit";
                        }
                    }

                    returnValue.Add(newEmployeeViewModel);
                }
            }
            else
            {
                var newEmployeeViewModel = new EmployeeViewModel
                {
                    FormMode = "add",
                    DepartmentId = 0,
                    DepartmentIdString = "0"
                };
                returnValue.Add(new EmployeeViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostEmployee")]
        public IActionResult Post([FromBody] EmployeeViewModel employeeViewModel)
        {
            IActionResult actionResult = BadRequest("Unknown Error");

            if (employeeViewModel != null)
            {
                if (employeeViewModel.FormMode == "add")
                {
                    var newTEmEmployee = new TEmEmployee();

                    Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, newTEmEmployee);

                    employeeManagerDbContext.TEmEmployees.Add(newTEmEmployee);
                    var addResult = employeeManagerDbContext.SaveChanges(true);

                    if (addResult > 0)
                    {
                        actionResult = Ok("Employee Added.");
                    }
                    else
                    {
                        actionResult = BadRequest("Could not be added.");
                    }
                }
                else
                {
                    var rowToUpdate = employeeManagerDbContext.TEmEmployees.Where(e => e.Id == employeeViewModel.Id).FirstOrDefault();

                    if (rowToUpdate != null)
                    {
                        Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmEmployees.Update(rowToUpdate);

                        var updateResult = employeeManagerDbContext.SaveChanges();

                        if (updateResult > 0)
                        {
                            actionResult = Ok("Employee Updated");
                        }
                        else
                        {
                            actionResult = BadRequest("Employee Update Failed.");
                        }
                    }
                    else
                    {
                        actionResult = BadRequest("Employee Record not found.");
                    }
                }
            }
            return actionResult;
        }

        [HttpDelete(Name = "DeleteEmployee")]
        public IActionResult Delete(int? Id)
        {
            IActionResult returnValue;

            if (Id == null)
            {
                returnValue = BadRequest("Must specify an ID.");
            }
            else
            {
                var employeeRow = employeeManagerDbContext.TEmEmployees.Where(e => e.Id == Id).FirstOrDefault();

                if (employeeRow != null)
                {
                    employeeManagerDbContext.TEmEmployees.Remove(employeeRow);
                    var deleteResult = employeeManagerDbContext.SaveChanges();

                    if (deleteResult > 0)
                    {
                        returnValue = Ok("Employee Deleted Successfully.");
                    }
                    else
                    {
                        returnValue = NotFound("Employee Delete Failed.");
                    }
                }
                else
                {
                    returnValue = NotFound("Employee Not Found.");
                }
            }
            return returnValue;
        }
    }
}

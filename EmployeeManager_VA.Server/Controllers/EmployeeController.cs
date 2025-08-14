using EmployeeManager_VA.Server.Data;
using EmployeeManager_VA.Server.Models;
using EmployeeManager_VA.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManager_VA.Server.Controllers
{
    [ApiController]
    [Route("[Controller]")]
    public class EmployeeController(ILogger<EmployeeController> logger, EmployeeManagerDbContext employeeManagerDbContext) : ControllerBase
    {
        private readonly ILogger<EmployeeController> _logger = logger;

        [HttpGet(Name = "GetEmployee")]
        public async Task<IEnumerable<EmployeeViewModel>> Get(int? id, string? mode, string? filter)
        {
            var employees = new List<TEmEmployee>();
            var returnValue = new List<EmployeeViewModel>();

            if (id != null && id != 0)
            {
                employees = await employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department).Where(e => e.Id == id).ToListAsync();
            }
            else
            {
                if (mode != null && mode.ToLower() == "list")
                {
                    employees = await employeeManagerDbContext.TEmEmployees.Include(dept => dept.Department).ToListAsync();
                }
            }

            if (employees.Count > 0)
            {
                var currentRow = 0;
                foreach (var employee in employees)
                {
                    var newEmployeeViewModel = new EmployeeViewModel();

                    Utilities.Utilities.CopySharedPropertyValues<TEmEmployee, EmployeeViewModel>(employee, newEmployeeViewModel);
                    newEmployeeViewModel.DepartmentId = employee.DepartmentId;
                    newEmployeeViewModel.DepartmentIdString = newEmployeeViewModel.DepartmentId.ToString();
                    newEmployeeViewModel.RowNum = currentRow;

                    if (employee.Department != null && employee.Department.Name != null)
                    {
                        newEmployeeViewModel.DepartmentName = employee.Department.Name;
                        if (mode != "list")
                        {
                            newEmployeeViewModel.FormMode = "edit";
                        }
                    }

                    returnValue.Add(newEmployeeViewModel);
                    currentRow++;
                }
            }
            else
            {
                var newEmployeeViewModel = new EmployeeViewModel
                {
                    FormMode = "add",
                    DepartmentId = 0,
                    DepartmentIdString = ""
                };
                returnValue.Add(new EmployeeViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostEmployee")]
        public async Task<IActionResult> Post([FromBody] EmployeeViewModel employeeViewModel)
        {
            IActionResult actionResult = BadRequest("Unknown Error");

            if (employeeViewModel != null)
            {
                if (employeeViewModel.FormMode == "add")
                {
                    var newTEmEmployee = new TEmEmployee();

                    Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, newTEmEmployee);

                    employeeManagerDbContext.TEmEmployees.Add(newTEmEmployee);
                    var addResult = await employeeManagerDbContext.SaveChangesAsync(true);

                    if (addResult > 0)
                    {
                        actionResult = Ok();
                    }
                    else
                    {
                        actionResult = BadRequest("Could not be added.");
                    }
                }
                else
                {
                    var rowToUpdate = await employeeManagerDbContext.TEmEmployees.Where(e => e.Id == employeeViewModel.Id).FirstOrDefaultAsync();

                    if (rowToUpdate != null)
                    {
                        Utilities.Utilities.CopySharedPropertyValues<EmployeeViewModel, TEmEmployee>(employeeViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmEmployees.Update(rowToUpdate);

                        var updateResult = await employeeManagerDbContext.SaveChangesAsync();

                        if (updateResult > 0)
                        {
                            actionResult = Ok();
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
        public async Task<IActionResult> Delete(int? Id)
        {
            IActionResult returnValue;

            if (Id == null)
            {
                returnValue = BadRequest("Must specify an ID.");
            }
            else
            {
                var employeeRow = await employeeManagerDbContext.TEmEmployees.Where(e => e.Id == Id).FirstOrDefaultAsync();

                if (employeeRow != null)
                {
                    employeeManagerDbContext.TEmEmployees.Remove(employeeRow);
                    var deleteResult = await employeeManagerDbContext.SaveChangesAsync();

                    if (deleteResult > 0)
                    {
                        returnValue = Ok();
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

using EmployeeManager_VA.Server.Data;
using EmployeeManager_VA.Server.Models;
using EmployeeManager_VA.Server.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

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
                departments = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == id).ToListAsync();
            }
            else
            {
                if (mode != null && mode.ToLower() == "list")
                {
                    departments = await employeeManagerDbContext.TEmDepartments.ToListAsync();
                }
            }

            if (departments.Count > 0)
            {
                var currentRow = 0;
                foreach (var department in departments)
                {
                    var newDepartmentViewModel = new DepartmentViewModel();

                    Utilities.Utilities.CopySharedPropertyValues<TEmDepartment, DepartmentViewModel>(department, newDepartmentViewModel);

                    if (department.Name != null)
                    {
                        if (mode != "list")
                        {
                            newDepartmentViewModel.FormMode = "edit";
                        }
                    }

                    returnValue.Add(newDepartmentViewModel);
                    currentRow++;
                }
            }
            else
            {
                var newDepartmentViewModel = new DepartmentViewModel
                {
                    FormMode = "add",
                };
                returnValue.Add(new DepartmentViewModel());
            }

            return returnValue;
        }

        [HttpPost(Name = "PostDepartment")]
        public async Task<IActionResult> Post([FromBody] DepartmentViewModel departmentViewModel)
        {
            IActionResult actionResult = BadRequest("Unknown Error");

            if (departmentViewModel != null)
            {
                if (departmentViewModel.FormMode == "add")
                {
                    var newTEmDepartment = new TEmDepartment();

                    Utilities.Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, newTEmDepartment);

                    employeeManagerDbContext.TEmDepartments.Add(newTEmDepartment);
                    var addResult = await employeeManagerDbContext.SaveChangesAsync(true);

                    if (addResult > 0)
                    {
                        var createdAtAction = new CreatedAtActionResult("post", "department", new { id = newTEmDepartment.Id }, newTEmDepartment);
                        actionResult = createdAtAction;
                    }
                    else
                    {
                        actionResult = BadRequest("Could not be added.");
                    }
                }
                else
                {
                    var rowToUpdate = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == departmentViewModel.Id).FirstOrDefaultAsync();

                    if (rowToUpdate != null)
                    {
                        Utilities.Utilities.CopySharedPropertyValues<DepartmentViewModel, TEmDepartment>(departmentViewModel, rowToUpdate);

                        employeeManagerDbContext.TEmDepartments.Update(rowToUpdate);

                        var updateResult = await employeeManagerDbContext.SaveChangesAsync();

                        if (updateResult > 0)
                        {
                            var updatedAtAction = new AcceptedAtActionResult("post", "department", new { id = rowToUpdate.Id }, rowToUpdate);
                            actionResult = updatedAtAction;
                        }
                        else
                        {
                            actionResult = BadRequest("Department Update Failed.");
                        }
                    }
                    else
                    {
                        actionResult = BadRequest("Department Record not found.");
                    }
                }
            }
            return actionResult;
        }
 
        [HttpDelete(Name = "DeleteDepartment")]
        public async Task<IActionResult> Delete(int? Id)
        {
            IActionResult returnValue;

            if (Id == null)
            {
                returnValue = BadRequest("Must specify an ID.");
            }
            else
            {
                var departmentRow = await employeeManagerDbContext.TEmDepartments.Where(e => e.Id == Id).FirstOrDefaultAsync();

                if (departmentRow != null)
                {
                    employeeManagerDbContext.TEmDepartments.Remove(departmentRow);
                    var deleteResult = await employeeManagerDbContext.SaveChangesAsync();

                    if (deleteResult > 0)
                    {
                        returnValue = Ok();
                    }
                    else
                    {
                        returnValue = NotFound("Department Delete Failed.");
                    }
                }
                else
                {
                    returnValue = NotFound("Department Not Found.");
                }
            }
            return returnValue;
        }
    }
}
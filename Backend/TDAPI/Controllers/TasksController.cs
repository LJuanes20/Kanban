using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TDAPI.Dtos.Tasks;
using TDAPI.Infraestructure;
using TDAPI.Models;
using TDAPI.Models.Dtos.Tasks;

namespace TDAPI.Controllers;

[ApiController]
[Route("api/boards/{boardId:int}/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private const int DefaultStatusId = 1; // Backlog

    private readonly AppDbContext _db;

    public TasksController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TaskResponse>>> GetByBoard(int boardId)
    {
        var boardExists = await _db.Boards.AnyAsync(b => b.Id == boardId);
        if (!boardExists)
            return NotFound(new { message = $"No existe el board {boardId}." });

        var tasks = await _db.Tasks
            .AsNoTracking()
            .Where(t => t.BoardId == boardId)
            .OrderBy(t => t.Status.Order)
            .ThenByDescending(t => t.CreatedAt)
            .Select(t => new TaskResponse(
                t.Id,
                t.BoardId,
                t.Title,
                t.Description,
                t.StatusId,
                t.Status.Name,
                t.Points,
                t.AssignedUserId,
                t.AssignedUser != null ? t.AssignedUser.DisplayName : null,
                t.CreatedById,
                t.CreatedBy.DisplayName,
                t.CreatedAt,
                t.UpdatedAt))
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPost]
    public async Task<ActionResult<TaskResponse>> Create(int boardId, CreateTaskRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var boardExists = await _db.Boards.AnyAsync(b => b.Id == boardId);
        if (!boardExists)
            return NotFound(new { message = $"No existe el board {boardId}." });

        var task = new TaskItem
        {
            BoardId = boardId,
            Title = request.Title,
            Description = request.Description,
            StatusId = DefaultStatusId,
            Points = request.Points,
            AssignedUserId = null,
            CreatedById = userId
        };

        _db.Tasks.Add(task);
        await _db.SaveChangesAsync();

        var response = await _db.Tasks
            .AsNoTracking()
            .Where(t => t.Id == task.Id)
            .Select(t => new TaskResponse(
                t.Id,
                t.BoardId,
                t.Title,
                t.Description,
                t.StatusId,
                t.Status.Name,
                t.Points,
                t.AssignedUserId,
                t.AssignedUser != null ? t.AssignedUser.DisplayName : null,
                t.CreatedById,
                t.CreatedBy.DisplayName,
                t.CreatedAt,
                t.UpdatedAt))
            .FirstAsync();

        return CreatedAtAction(nameof(GetByBoard), new { boardId = task.BoardId }, response);
    }

    [HttpPatch("{taskId:int}/status")]
    public async Task<ActionResult<TaskResponse>> UpdateStatus(
    int boardId,
    int taskId,
    UpdateTaskStatusRequest request)
    {
        var task = await _db.Tasks
            .FirstOrDefaultAsync(t => t.Id == taskId && t.BoardId == boardId);

        if (task is null)
            return NotFound(new { message = $"No existe la tarea {taskId} en el board {boardId}." });

        var statusExists = await _db.Statuses.AnyAsync(s => s.Id == request.StatusId);
        if (!statusExists)
            return BadRequest(new { message = $"El status {request.StatusId} no existe." });

        task.StatusId = request.StatusId;
        task.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        var response = await _db.Tasks
            .AsNoTracking()
            .Where(t => t.Id == task.Id)
            .Select(t => new TaskResponse(
                t.Id,
                t.BoardId,
                t.Title,
                t.Description,
                t.StatusId,
                t.Status.Name,
                t.Points,
                t.AssignedUserId,
                t.AssignedUser != null ? t.AssignedUser.DisplayName : null,
                t.CreatedById,
                t.CreatedBy.DisplayName,
                t.CreatedAt,
                t.UpdatedAt))
            .FirstAsync();

        return Ok(response);
    }
}
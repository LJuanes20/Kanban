using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TDAPI.Infraestructure;
using TDAPI.Models;
using TDAPI.Models.Dtos.Boards;

namespace TDAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BoardsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BoardsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BoardResponse>>> GetAll()
    {
        var boards = await _db.Boards
            .AsNoTracking()
            .Include(b => b.Owner)
            .OrderByDescending(b => b.CreatedAt)
            .Select(b => new BoardResponse(
                b.Id,
                b.Name,
                b.Description,
                b.CreatedAt,
                new BoardOwnerResponse(b.Owner.Id, b.Owner.DisplayName)))
            .ToListAsync();

        return Ok(boards);
    }

    [HttpPost]
    public async Task<ActionResult<BoardResponse>> Create(CreateBoardRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId))
            return Unauthorized();

        var board = new Board
        {
            Name = request.Name,
            Description = request.Description,
            OwnerId = userId
        };

        _db.Boards.Add(board);
        await _db.SaveChangesAsync();

        var owner = await _db.Users
            .Where(u => u.Id == userId)
            .Select(u => new BoardOwnerResponse(u.Id, u.DisplayName))
            .FirstAsync();

        var response = new BoardResponse(
            board.Id,
            board.Name,
            board.Description,
            board.CreatedAt,
            owner);

        return CreatedAtAction(nameof(GetAll), new { id = board.Id }, response);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BoardResponse>> GetById(int id)
    {
        var board = await _db.Boards
            .AsNoTracking()
            .Include(b => b.Owner)
            .Where(b => b.Id == id)
            .Select(b => new BoardResponse(
                b.Id,
                b.Name,
                b.Description,
                b.CreatedAt,
                new BoardOwnerResponse(b.Owner.Id, b.Owner.DisplayName)))
            .FirstOrDefaultAsync();

        if (board is null)
            return NotFound(new { message = $"No existe el board {id}." });

        return Ok(board);
    }
}
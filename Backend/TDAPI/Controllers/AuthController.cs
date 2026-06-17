using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TDAPI.Models;
using TDAPI.Models.Dtos;
using TDAPI.Models.JWT;

namespace TDAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IConfiguration _config;

        public AuthController(UserManager<ApplicationUser> userManager, IJwtTokenService jwtTokenService, IConfiguration config)
        {
            _userManager = userManager;
            _jwtTokenService = jwtTokenService;
            _config = config;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
        {
            var existing = await _userManager.FindByEmailAsync(request.Email);
            if (existing is not null)
                return Conflict(new { message = "Ya existe un usuario con ese email." });

            var user = new ApplicationUser
            {
                UserName = request.Email,
                Email = request.Email,
                DisplayName = request.DisplayName
            };

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
                return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

            return Ok(BuildAuthResponse(user));
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
        {
            var user = await _userManager.FindByEmailAsync(request.Email);
            if (user is null)
                return Unauthorized(new { message = "Credenciales inválidas." });

            var passwordOk = await _userManager.CheckPasswordAsync(user, request.Password);
            if (!passwordOk)
                return Unauthorized(new { message = "Credenciales inválidas." });

            return Ok(BuildAuthResponse(user));
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserResponse>> Me()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId))
                return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
                return NotFound();

            return Ok(new UserResponse(user.Id, user.Email ?? string.Empty, user.DisplayName));
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            return NoContent();
        }

        private AuthResponse BuildAuthResponse(ApplicationUser user)
        {
            var token = _jwtTokenService.GenerateToken(user);
            var expirationMinutes = int.Parse(_config["Jwt:ExpirationMinutes"] ?? "60");
            var expiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes);

            var userDto = new UserResponse(user.Id, user.Email ?? string.Empty, user.DisplayName);
            return new AuthResponse(token, expiresAt, userDto);
        }
    }
}

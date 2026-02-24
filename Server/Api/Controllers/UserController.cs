using System.Security.Claims;
using Contracts.Models.UserDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Service.Interfaces;

namespace Api.Controllers;

public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    
    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [Authorize]
    [HttpGet("me")]
    public async Task<ActionResult<UserDTO>> GetMe()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized();

        var user = await _userService.GetByIdAsync(userId);
        return user is null ? NotFound() : Ok(user);
    }
    
}
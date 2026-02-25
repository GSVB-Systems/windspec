using Contracts.Models.UserDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Service.Auth;
using Service.Interfaces;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly TokenService _tokenService;
    private readonly IUserService _userService;

    public AuthController(TokenService tokenService, IUserService userService)
    {
        _tokenService = tokenService;
        _userService = userService;
    }
}
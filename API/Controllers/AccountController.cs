using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.AspNetCore.Identity;
using API.DTOs;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<UserApp> _userManager;
        private readonly SignInManager<UserApp> _signInManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<UserApp> userManager, SignInManager<UserApp> signInManager, TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDto)
        {
            var user = await _userManager.FindByEmailAsync(loginDto.Email);
            if(user == null) return Unauthorized();

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);
            if (result.Succeeded)
            {
                return CreateUserDTOObject(user);
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDto)
        {
            if(await _userManager.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email already existed !");
                return ValidationProblem();
            }
            if (await _userManager.Users.AnyAsync(u => u.UserName == registerDto.UserName))
            {
                ModelState.AddModelError("username", "Username ready existed !");
                return ValidationProblem();
            }

            var user = new UserApp
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.UserName
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (result.Succeeded)
            {
                return CreateUserDTOObject(user);
            }

            ModelState.AddModelError("problem", "Problem occured in register process !");
            return ValidationProblem();
        }

        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return CreateUserDTOObject(user);
        }

        #region Helper Method
        private UserDTO CreateUserDTOObject(UserApp user)
        {
            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = null,
                UserName = user.UserName,
                Token = _tokenService.CreateToken(user)
            };
        }
        #endregion
    }
}

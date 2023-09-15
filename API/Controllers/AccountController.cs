using API.Data;
using API.DTOS;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Services;
using API.Entities.OrderAggregate;

namespace API.Controllers
{
    public class AccountController:BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager,TokenService tokenService,StoreContext context)
        {   
            _userManager=userManager;
            _tokenService=tokenService;
            _context=context;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login (LoginDTO login){
            var user=await _userManager.FindByNameAsync(login.Username);
            if (user==null || !await _userManager.CheckPasswordAsync(user,login.Password))
            return Unauthorized();
            var userBasket=await RetrieveBasket(login.Username);
            var anonBasket=await RetrieveBasket(Request.Cookies["buyerId"]);
            if (anonBasket!=null){
                if (userBasket!=null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId=user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }
            return new UserDTO{
                Email=user.Email,
                Token=await _tokenService.GenerateToken(user),
                Basket=anonBasket !=null ? anonBasket.MapBasketToDto():userBasket?.MapBasketToDto()
            };
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register (RegisterDTO register){
            var user =new User{UserName=register.Username,Email=register.Email};
            var result=await _userManager.CreateAsync(user,register.Password);
            if (!result.Succeeded){
            foreach (var error in result.Errors){
                ModelState.AddModelError(error.Code,error.Description);
            }
            return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user,"Member");
            return StatusCode(201);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser (){
            var user=await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket=await RetrieveBasket(User.Identity.Name);
            return new UserDTO{
                Email=user.Email,
                Token=await _tokenService.GenerateToken(user),
                Basket=userBasket?.MapBasketToDto()
            };
        }
        [Authorize]
        [HttpGet("savedAdress")]
        public async Task<ActionResult<UserAdress>> GetSavedAdress(){
            return await _userManager.Users.Where(x=>x.UserName==User.Identity.Name)
            .Select(user=>user.Adress).FirstOrDefaultAsync();
        }
         private async Task<Basket> RetrieveBasket(string buyerId)
        {   if (string.IsNullOrEmpty(buyerId)){
            Response.Cookies.Delete("buyerId");
            return null;
        }
            return await _context.Baskets.Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(i => i.BuyerId == buyerId);
        }
    }
}
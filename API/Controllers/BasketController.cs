using API.Data;
using API.DTOS;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers
{
    public class BasketController:BaseApiController
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context )
        {
            _context=context;
        }
        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasket()
        {
            var basket = await RetrieveBasket(GetBuyerId());
            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

        


        [HttpPost]
        public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId,int quantity){
            var basket=await RetrieveBasket(GetBuyerId());
            if (basket==null) basket=CreateBasket();
            var product=_context.Products.FirstOrDefault(i=>i.Id==productId);
            if (product == null) return BadRequest(new ProblemDetails { Title = "Product not found" });
            basket.addItem(product,quantity);
            var result=await _context.SaveChangesAsync()>0;
            if (result) return CreatedAtRoute("GetBasket",basket.MapBasketToDto());
            return BadRequest(new ProblemDetails{Title="Problem saving items to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId,int quantity){
            var basket =await RetrieveBasket(GetBuyerId());
            if (basket ==null) return NotFound();
            basket.removeItem(productId,quantity);
            var result=await _context.SaveChangesAsync()>0;
            if (result)return Ok();
            return BadRequest(new ProblemDetails{Title="Cant remove item from basket"});
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
        private string GetBuyerId(){
            return User.Identity.Name ?? Request.Cookies["buyerId"];
        }
        private Basket CreateBasket()
        {
            var buyerId=User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)){
                buyerId=Guid.NewGuid().ToString();
            }
            var cookieOptions=new CookieOptions{IsEssential=true,Expires=DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId",buyerId,cookieOptions);
            var basket=new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
       

    }
}
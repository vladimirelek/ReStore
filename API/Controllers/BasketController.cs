using API.Data;
using API.DTOS;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class BasketController:BaseApiContoller
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context )
        {
            _context=context;
        }
        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDTO>> GetBasket()
        {
            var basket = await RetrieveBasket();
            if (basket == null) return NotFound();
            return MapBasketToDTO(basket);
        }

        


        [HttpPost]
        public async Task<ActionResult<BasketDTO>> AddItemToBasket(int productId,int quantity){
            var basket=await RetrieveBasket();
            if (basket==null) basket=CreateBasket();
            var product=_context.Products.FirstOrDefault(i=>i.Id==productId);
            if (product==null) return NotFound();
            basket.addItem(product,quantity);
            var result=await _context.SaveChangesAsync()>0;
            if (result) return CreatedAtRoute("GetBasket",MapBasketToDTO(basket));
            return BadRequest(new ProblemDetails{Title="Problem saving items to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId,int quantity){
            var basket =await RetrieveBasket();
            if (basket ==null) return NotFound();
            basket.removeItem(productId,quantity);
            var result=await _context.SaveChangesAsync()>0;
            if (result)return Ok();
            return BadRequest(new ProblemDetails{Title="Cant remove item from basket"});
        }
        private async Task<Basket> RetrieveBasket()
        {
            return await _context.Baskets.Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(i => i.BuyerId == Request.Cookies["buyerId"]);
        }
        private Basket CreateBasket()
        {
            var buyerId=Guid.NewGuid().ToString();
            var cookieOptions=new CookieOptions{IsEssential=true,Expires=DateTime.Now.AddDays(30)};
            Response.Cookies.Append("buyerId",buyerId,cookieOptions);
            var basket=new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
         private BasketDTO MapBasketToDTO(Basket basket)
        {
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDTO
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }

    }
}
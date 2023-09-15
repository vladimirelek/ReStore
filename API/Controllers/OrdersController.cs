using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOS;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Authorize]
    public class OrdersController:BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context=context;
        }
        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders(){
            return await _context.Orders.ProjectOrderToOrderDTO()
            .Where(x=>x.BuyerId==User.Identity.Name).ToListAsync();
        }
        [HttpGet("{Id}",Name="GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id){
                return await _context.Orders.ProjectOrderToOrderDTO()
                .Where(x=>x.BuyerId==User.Identity.Name && x.Id==id)
                .FirstOrDefaultAsync();
        }
        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDTO orderDTO){
            var basket=await _context.Baskets
            .RetrieveBasketWithItems(User.Identity.Name)
            .FirstOrDefaultAsync();
            if (basket==null) return BadRequest(new ProblemDetails{Title="Could not locate basket"});
            var items=new List<OrderItem>();
            foreach(var item in basket.Items){
                var productItem=await _context.Products.FindAsync(item.ProductId);
                var itemOrdered=new ProductItemOrdered{
                    ProductId=productItem.Id,
                    Name=productItem.Name,
                    PictureUrl=productItem.PictureUrl,
                };
                var orderItem=new OrderItem{
                    ItemOrdered=itemOrdered,
                    Price=productItem.Price,
                    Quantity=item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock-=item.Quantity;
            }
            var subtotal=items.Sum(item=>item.Price*item.Quantity);
            var deliveryFee=subtotal>10000?0:500;
            var order=new Order{
                OrderItems=items,
                BuyerId=User.Identity.Name,
                ShippingAddress=orderDTO.ShippingAdress,
                Subtotal=subtotal,
                DeliveryFee=deliveryFee
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);
            if (orderDTO.SaveAdress){
                var user=await _context.Users
                .Include(a=>a.Adress)
                .FirstOrDefaultAsync(x=>x.UserName==User.Identity.Name);
                var adress=new UserAdress{
                     FullName = orderDTO.ShippingAdress.FullName,
                    Address1 = orderDTO.ShippingAdress.Address1,
                    Address2 = orderDTO.ShippingAdress.Address2,
                    City = orderDTO.ShippingAdress.City,
                    State = orderDTO.ShippingAdress.State,
                    Zip = orderDTO.ShippingAdress.Zip,
                    Country = orderDTO.ShippingAdress.Country
                };
                user.Adress=adress;
                _context.Update(user);
                
            }
            var result =await _context.SaveChangesAsync()>0;
            if (result) return CreatedAtRoute("GetOrder",new {id=order.Id},order.Id);
            return BadRequest("Problem creating oreder");
        }
    }
}
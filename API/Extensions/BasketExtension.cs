using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.DTOS;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class BasketExtension
    {
        public static BasketDTO MapBasketToDto(this Basket basket){
            return new BasketDTO
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                PaymentIntentId=basket.PaymentIntentId,
                ClientSecret=basket.ClientSecret,
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
        public static IQueryable<Basket> RetrieveBasketWithItems(this IQueryable<Basket> query,string buyerId){
           return query.Include(i=>i.Items).ThenInclude(p=>p.Product).Where(b=>b.BuyerId==buyerId);
        }
    }
}
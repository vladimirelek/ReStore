using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Basket
    {
        public int Id {get;set;}
        public string BuyerId {get;set;}
        public List<BasketItem> Items {get;set;}=new ();
        public void addItem(Product product,int quantity){
            if (Items.All(item=>product.Id!=item.ProductId)){
                Items.Add(new BasketItem{Product=product,Quantity=quantity});
            }
            var existingItem=Items.FirstOrDefault(item=>item.ProductId==product.Id);
            if (existingItem!=null) existingItem.Quantity+=quantity;

        }
        public void removeItem(int productId,int quantity){
            var existingItem=Items.FirstOrDefault(item=>item.ProductId==productId);
            if (existingItem==null) return;
            existingItem.Quantity-=quantity;
            if (existingItem.Quantity==0) Items.Remove(existingItem);
        }

    }
}
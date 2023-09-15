using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities.OrderAggregate;

namespace API.DTOS
{
    public class CreateOrderDTO
    {
        public bool SaveAdress {get;set;}
        public ShippingAdress ShippingAdress{get;set;}
    }
}
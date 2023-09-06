using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOS
{
    public class UserDTO
    {
        public string Email {get;set;}
        public string Token {get;set;}
        public BasketDTO Basket { get; set; }
    }
}
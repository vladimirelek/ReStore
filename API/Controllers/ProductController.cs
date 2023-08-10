using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    
    public class ProductController:BaseApiContoller
    {
        private readonly StoreContext _context;
        public ProductController(StoreContext context)
        {
            _context=context;
        }
        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetAllProducts(){
            var products=await _context.Products.ToListAsync();
            if (products==null) return NotFound();
            return products;
            
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Product>> GetProduct(int Id){
            var product=await _context.Products.FirstOrDefaultAsync(p=>p.Id==Id);
            if (product == null) return NotFound();
            return product;
        }
    }
}
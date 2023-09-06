using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Extensions;

namespace API.Controllers
{
    
    public class ProductController:BaseApiController
    {
        private readonly StoreContext _context;
        public ProductController(StoreContext context)
        {
            _context=context;
        }
        [HttpGet]
        public async Task<ActionResult<PagedList<Product>>> GetAllProducts([FromQuery]ProductParams productParams){
            var query=_context.Products.
            Sort(productParams.OrderBy).
            Search(productParams.SearchTerm).
            Filter(productParams.Brands,productParams.Types).
            AsQueryable();
            var products=await PagedList<Product>.ToPagedList(query,productParams.PageNumber,productParams.PageSize);
            Response.AddPaginationHeader(products.MetaData);
            return products;
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Product>> GetProduct(int Id){
            var product=await _context.Products.FirstOrDefaultAsync(p=>p.Id==Id);
            if (product == null) return NotFound();
            return product;
        }
        [HttpGet("filter")]
        public async Task<ActionResult> GetFilters(){
            var brands=await _context.Products.Select(p=>p.Brand).Distinct().ToListAsync();
            var types=await _context.Products.Select(p=>p.Type).Distinct().ToListAsync();
            return Ok(new {brands,types});
        }
    }
}
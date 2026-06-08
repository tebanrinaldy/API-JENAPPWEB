using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Webapi.Data;
using Webapi.Models;

namespace Webapi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class SaleDetailsController : ControllerBase
    {
        private readonly Connectioncontextdb _context;

        public SaleDetailsController(Connectioncontextdb context)
        {
            _context = context;
        }

        // GET: api/SaleDetails
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SaleDetail>>> GetSaleDetails()
        {
            return await _context.SaleDetails.ToListAsync();
        }

        // GET: api/SaleDetails/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SaleDetail>> GetSaleDetail(int id)
        {
            var saleDetail = await _context.SaleDetails.FirstOrDefaultAsync(d => d.Id == id);

            if (saleDetail == null)
            {
                return NotFound();
            }

            return saleDetail;
        }

        // PUT: api/SaleDetails/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSaleDetail(int id, SaleDetail saleDetail)
        {
            if (id != saleDetail.Id)
            {
                return BadRequest();
            }

            var existing = await _context.SaleDetails.FirstOrDefaultAsync(d => d.Id == id);
            if (existing == null)
                return NotFound();

            var product = await _context.Products.FirstOrDefaultAsync(p => p.Id == saleDetail.ProductId);
            if (product == null)
                return BadRequest("El producto no existe para este tenant.");

            existing.ProductId = saleDetail.ProductId;
            existing.Quantity = saleDetail.Quantity;
            existing.UnitPrice = saleDetail.UnitPrice;
            existing.TotalPrice = saleDetail.TotalPrice;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SaleDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/SaleDetails
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SaleDetail>> PostSaleDetail(SaleDetail saleDetail)
        {
            var saleExists = await _context.Sales.AnyAsync(s => s.Id == saleDetail.SaleId);
            if (!saleExists)
                return BadRequest("La venta no existe para este tenant.");

            var productExists = await _context.Products.AnyAsync(p => p.Id == saleDetail.ProductId);
            if (!productExists)
                return BadRequest("El producto no existe para este tenant.");

            _context.SaleDetails.Add(saleDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSaleDetail", new { id = saleDetail.Id }, saleDetail);
        }

        // DELETE: api/SaleDetails/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSaleDetail(int id)
        {
            var saleDetail = await _context.SaleDetails.FirstOrDefaultAsync(d => d.Id == id);
            if (saleDetail == null)
            {
                return NotFound();
            }

            _context.SaleDetails.Remove(saleDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SaleDetailExists(int id)
        {
            return _context.SaleDetails.Any(e => e.Id == id);
        }
    }
}

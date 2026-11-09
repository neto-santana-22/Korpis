using backend.Domain.Entities;
using backend.Domain.Interfaces;
using backend.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // Retorna o resumo consolidado de métricas financeiras e de clientes
        [HttpGet]
        public async Task<IActionResult> GetMetrics()
        {
            var totalClients = await _context.Clients.CountAsync();
            var totalCharges = await _context.Charges.CountAsync();

            var totalReceived = await _context.Charges
                .Where(c => c.Status == ChargeStatus.Paid)
                .SumAsync(c => (decimal?)c.Amount) ?? 0m;

            var totalPending = await _context.Charges
                .Where(c => c.Status == ChargeStatus.Pending)
                .SumAsync(c => (decimal?)c.Amount) ?? 0m;

            var metrics = new DashboardMetricsDto
            {
                TotalClients = totalClients,
                TotalCharges = totalCharges,
                TotalReceivedAmount = totalReceived,
                TotalPendingAmount = totalPending
            };

            return Ok(metrics);
        }
    }

    // DTO com as métricas consolidadas do sistema
    public class DashboardMetricsDto
    {
        public int TotalClients { get; set; }
        public int TotalCharges { get; set; }
        public decimal TotalReceivedAmount { get; set; }
        public decimal TotalPendingAmount { get; set; }
    }
}
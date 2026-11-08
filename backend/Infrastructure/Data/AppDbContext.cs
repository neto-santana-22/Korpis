using backend.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Charge> Charges => Set<Charge>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Client>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Name).IsRequired().HasMaxLength(150);
            entity.Property(c => c.Document).IsRequired().HasMaxLength(20);
            entity.Property(c => c.Email).HasMaxLength(100);
            entity.Property(c => c.Phone).IsRequired().HasMaxLength(20);
        });

        modelBuilder.Entity<Charge>(entity =>
        {
            entity.HasKey(c => c.Id);
            entity.Property(c => c.Amount).HasPrecision(18, 2);
            entity.Property(c => c.Description).HasMaxLength(250);
            entity.Property(c => c.Status).HasConversion<int>();

            entity.HasOne(c => c.Client)
                  .WithMany(cl => cl.Charges)
                  .HasForeignKey(c => c.ClientId)
                  .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
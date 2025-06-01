using DrCell_V01.Data.Modelos;
using DrCell_V01.Data.Vistas;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;

namespace DrCell_V01.Data
{
    public class ApplicationDbContext : IdentityDbContext<Usuario, IdentityRole<int>, int>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
             : base(options) { }

        public DbSet<Celular> Celulares { get; set; }
        public DbSet<Modulos> Modulos { get; set; }
        public DbSet<Baterias> Baterias { get; set; }
        public DbSet<Pines> Pines { get; set; }
        ///VISTAS
        public DbSet<vCelularesMBP> vCelularesMBP => Set<vCelularesMBP>();
        public DbSet<vCelularM> vCelularM => Set<vCelularM>();
        public DbSet<vCelularB> vCelularB => Set<vCelularB>();
        public DbSet<vCelularP> vCelularP => Set<vCelularP>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Celular>()
                .ToTable("celulares")
                .HasKey(e => e.id);
            modelBuilder.Entity<Modulos>()
                .ToTable("modulos")
                .HasKey(m => m.id);
            modelBuilder.Entity<Baterias>()
                .ToTable("baterias")
                .HasKey(b => b.id);
            modelBuilder.Entity<Pines>()
                .ToTable("pines")
                .HasKey(p => p.id);

            modelBuilder.Entity<vCelularesMBP>().HasNoKey().ToView("vcelularesmbp");
            modelBuilder.Entity<vCelularM>().HasNoKey().ToView("vcelularm");
            modelBuilder.Entity<vCelularB>().HasNoKey().ToView("vcelularb");
            modelBuilder.Entity<vCelularP>().HasNoKey().ToView("vcelularp");

        }
    }
}

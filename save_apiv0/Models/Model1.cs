using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace save_apiv0.Models
{
    public partial class Model1 : DbContext
    {
        public Model1()
            : base("name=Model11")
        {
        }

        public virtual DbSet<Historial> Historial { get; set; }
        public virtual DbSet<HistorialKilometraje> HistorialKilometraje { get; set; }
        public virtual DbSet<ImagenBanner> ImagenBanner { get; set; }
        public virtual DbSet<Reparacion> Reparacion { get; set; }
        public virtual DbSet<Servicio> Servicio { get; set; }
        public virtual DbSet<Usuario> Usuario { get; set; }
        public virtual DbSet<Vehiculo> Vehiculo { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<HistorialKilometraje>()
                .Property(e => e.kilometrajeAnterior)
                .HasPrecision(10, 2);

            modelBuilder.Entity<HistorialKilometraje>()
                .Property(e => e.kilometrajeNuevo)
                .HasPrecision(10, 2);

            modelBuilder.Entity<ImagenBanner>()
                .Property(e => e.imagen)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.tipoReparacion)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.descripccion)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.ubicacionReparacion)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.nombreMecanico)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.presupuesto)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .Property(e => e.observaciones)
                .IsUnicode(false);

            modelBuilder.Entity<Reparacion>()
                .HasMany(e => e.Historial)
                .WithOptional(e => e.Reparacion)
                .HasForeignKey(e => e.id_reparacion);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.kilometrajeServicio)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.tipoServicio)
                .IsUnicode(false);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.ubicacionServicio)
                .IsUnicode(false);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.mecanico)
                .IsUnicode(false);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.descripcion)
                .IsUnicode(false);

            modelBuilder.Entity<Servicio>()
                .Property(e => e.presupuesto)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Servicio>()
                .HasMany(e => e.Historial)
                .WithOptional(e => e.Servicio)
                .HasForeignKey(e => e.id_servicio);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.nombre)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.apePaterno)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.apeMaterno)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.telefono)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.email)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.contrasena)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.gobierno)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.nivel)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.zona)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .Property(e => e.centroTrabajo)
                .IsUnicode(false);

            modelBuilder.Entity<Usuario>()
                .HasMany(e => e.Historial)
                .WithOptional(e => e.Usuario)
                .HasForeignKey(e => e.id_usuario);

            modelBuilder.Entity<Usuario>()
                .HasMany(e => e.Vehiculo)
                .WithRequired(e => e.Usuario)
                .HasForeignKey(e => e.id_usuario)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.marca)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.modelo)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.tipo)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.placas)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.imagen)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.combustible)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.kilometrajeRegistro)
                .HasPrecision(18, 0);

            modelBuilder.Entity<Vehiculo>()
                .Property(e => e.comparteCon)
                .IsUnicode(false);

            modelBuilder.Entity<Vehiculo>()
                .HasMany(e => e.Historial)
                .WithRequired(e => e.Vehiculo)
                .HasForeignKey(e => e.id_vehiculo)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Vehiculo>()
                .HasMany(e => e.Reparacion)
                .WithRequired(e => e.Vehiculo)
                .HasForeignKey(e => e.id_vehiculo)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Vehiculo>()
                .HasMany(e => e.Servicio)
                .WithOptional(e => e.Vehiculo)
                .HasForeignKey(e => e.id_vehiculo);
        }
    }
}

namespace save_apiv0.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Reparacion")]
    public partial class Reparacion
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Reparacion()
        {
            Historial = new HashSet<Historial>();
        }

        public int id { get; set; }

        public DateTime fecha { get; set; }

        public DateTime? fechaFin { get; set; }

        [Required]
        [StringLength(255)]
        public string tipoReparacion { get; set; }

        [StringLength(255)]
        public string descripccion { get; set; }

        public string ubicacionReparacion { get; set; }

        [StringLength(255)]
        public string nombreMecanico { get; set; }

        public decimal? presupuesto { get; set; }

        public string descripcion { get; set; }

        [StringLength(255)]
        public string observaciones { get; set; }

        public int id_vehiculo { get; set; }

        public bool? estatus { get; set; }

        public int? estatusReparacion { get; set; }

        [JsonIgnore]
        public virtual ICollection<Historial> Historial { get; set; }

        public virtual Vehiculo Vehiculo { get; set; }
    }
}

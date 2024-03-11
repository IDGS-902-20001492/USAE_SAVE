namespace save_apiv0.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Usuario")]
    public partial class Usuario
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Usuario()
        {
            Historial = new HashSet<Historial>();
            Vehiculo = new HashSet<Vehiculo>();
        }

        public int id { get; set; }

        [Required]
        [StringLength(255)]
        public string nombre { get; set; }

        [Required]
        [StringLength(255)]
        public string apePaterno { get; set; }

        [Required]
        [StringLength(255)]
        public string apeMaterno { get; set; }

        [StringLength(255)]
        public string telefono { get; set; }

        [Required]
        [StringLength(255)]
        public string email { get; set; }

        [Required]
        [StringLength(255)]
        public string contrasena { get; set; }

        [StringLength(255)]
        public string gobierno { get; set; }

        [StringLength(255)]
        public string nivel { get; set; }

        [StringLength(255)]
        public string zona { get; set; }

        [StringLength(255)]
        public string centroTrabajo { get; set; }

        public int permiso { get; set; }

        public bool? estatus { get; set; }

        [JsonIgnore]
        public virtual ICollection<Historial> Historial { get; set; }

        [JsonIgnore]
        public virtual ICollection<Vehiculo> Vehiculo { get; set; }
    }
}

namespace save_apiv0.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Vehiculo")]
    public partial class Vehiculo
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Vehiculo()
        {
            Historial = new HashSet<Historial>();
            Reparacion = new HashSet<Reparacion>();
            Servicio = new HashSet<Servicio>();
        }

        public int id { get; set; }

        [Required]
        [StringLength(255)]
        public string marca { get; set; }

        [Required]
        [StringLength(255)]
        public string modelo { get; set; }

        [Required]
        [StringLength(255)]
        public string tipo { get; set; }

        [Required]
        [StringLength(255)]
        public string placas { get; set; }

        public string imagen { get; set; }

        [StringLength(255)]
        public string combustible { get; set; }

        public decimal? kilometrajeRegistro { get; set; }

        public string comparteCon { get; set; }

        public int id_usuario { get; set; }

        public bool? estatus { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<Historial> Historial { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<Reparacion> Reparacion { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        [JsonIgnore]
        public virtual ICollection<Servicio> Servicio { get; set; }

        public virtual Usuario Usuario { get; set; }
    }
}

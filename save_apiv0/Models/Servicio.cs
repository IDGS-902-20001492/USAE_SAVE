namespace save_apiv0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Servicio")]
    public partial class Servicio
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Servicio()
        {
            Historial = new HashSet<Historial>();
        }

        public int id { get; set; }

        public DateTime fechaProgramada { get; set; }

        public decimal kilometrajeServicio { get; set; }

        [Required]
        [StringLength(255)]
        public string tipoServicio { get; set; }

        public string ubicacionServicio { get; set; }

        [StringLength(255)]
        public string mecanico { get; set; }

        public int? id_pieza { get; set; }

        public bool? estatus { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Historial> Historial { get; set; }

        public virtual Pieza Pieza { get; set; }
    }
}

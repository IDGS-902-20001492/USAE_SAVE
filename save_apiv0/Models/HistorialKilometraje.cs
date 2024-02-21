namespace save_apiv0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("HistorialKilometraje")]
    public partial class HistorialKilometraje
    {
        public int id { get; set; }

        public int? vehiculoID { get; set; }

        public decimal? kilometrajeAnterior { get; set; }

        public decimal? kilometrajeNuevo { get; set; }

        public DateTime? fechaActualizacion { get; set; }

        public bool? visto { get; set; }

        public virtual Vehiculo Vehiculo { get; set; }
    }
}

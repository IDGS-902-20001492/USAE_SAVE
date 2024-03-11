namespace save_apiv0.Models
{
    using Newtonsoft.Json;
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Historial")]
    public partial class Historial
    {
        public int id { get; set; }

        public int id_vehiculo { get; set; }

        public int? id_usuario { get; set; }

        public int? id_reparacion { get; set; }

        public int? id_servicio { get; set; }

        public virtual Reparacion Reparacion { get; set; }

        public virtual Servicio Servicio { get; set; }

        [JsonIgnore]
        public virtual Usuario Usuario { get; set; }

        [JsonIgnore]
        public virtual Vehiculo Vehiculo { get; set; }
    }
}

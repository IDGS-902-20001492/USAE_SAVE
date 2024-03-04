namespace save_apiv0.Models
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("ImagenBanner")]
    public partial class ImagenBanner
    {
        public int id { get; set; }

        public string imagen { get; set; }
    }
}

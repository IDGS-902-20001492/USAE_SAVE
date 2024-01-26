using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Description;
using save_apiv0.Models;

namespace save_apiv0.Controllers
{
    public class VehiculosController : ApiController
    {
        private Model1 db = new Model1();

        // GET: api/Vehiculos
        public IQueryable<Vehiculo> GetVehiculo()
        {
            //Retornamos todos los que tengan estatus en true
            return db.Vehiculo.Where(e => e.estatus == true);
        }

        // GET: api/Vehiculos/5
        [ResponseType(typeof(Vehiculo))]
        public IHttpActionResult GetVehiculo(int id)
        {
            Vehiculo vehiculo = db.Vehiculo.Find(id);
            if (vehiculo == null)
            {
                return NotFound();
            }

            return Ok(vehiculo);
        }

        // GET: api/Vehiculos/Search?query={cadena}
        [HttpGet]
        [Route("api/Vehiculos/Search")]
        public IHttpActionResult SearchVehiculos(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("La cadena de búsqueda no puede estar vacía");
            }

            // Buscar coincidencias en varios campos
            var resultados = db.Vehiculo
                .Where(u =>
                       u.estatus == true &&
                      (u.placas.Contains(query) ||
                       u.modelo.Contains(query) ||
                       u.marca.Contains(query) ||
                       u.comparteCon.Contains(query) ||
                       u.Usuario.nombre.Contains(query)
                       ));

            return Ok(resultados);
        }


        // PUT: api/Vehiculos/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutVehiculo(int id, Vehiculo vehiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != vehiculo.id)
            {
                return BadRequest();
            }

            db.Entry(vehiculo).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!VehiculoExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/Vehiculos
        [ResponseType(typeof(Vehiculo))]
        public IHttpActionResult PostVehiculo(Vehiculo vehiculo)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Vehiculo.Add(vehiculo);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = vehiculo.id }, vehiculo);
        }

        // DELETE: api/Vehiculos/5
        [ResponseType(typeof(Vehiculo))]
        public IHttpActionResult DeleteVehiculo(int id)
        {
            Vehiculo vehiculo = db.Vehiculo.Find(id);
            if (vehiculo == null)
            {
                return NotFound();
            }

            //Le ponemos el estatus en falso 
            vehiculo.estatus = false;
            db.Entry(vehiculo).State = EntityState.Modified;
            db.SaveChanges();

            return Ok(vehiculo);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool VehiculoExists(int id)
        {
            return db.Vehiculo.Count(e => e.id == id) > 0;
        }
    }
}
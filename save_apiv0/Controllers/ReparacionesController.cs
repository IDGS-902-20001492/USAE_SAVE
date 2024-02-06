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
    public class ReparacionesController : ApiController
    {
        private Model1 db = new Model1();

        // GET: api/Reparaciones
        public IQueryable<Reparacion> GetReparacion()
        {
            return db.Reparacion.Where(x => x.estatus == true);
        }

        // GET: api/Reparaciones/5
        [ResponseType(typeof(Reparacion))]
        public IHttpActionResult GetReparacion(int id)
        {
            Reparacion reparacion = db.Reparacion.Find(id);
            if (reparacion == null)
            {
                return NotFound();
            }

            return Ok(reparacion);
        }

        //Metodo para obtener las reparaciones basadas en la id de un usuario
        // GET: api/Reparaciones/Search/5
        [HttpGet]
        [Route("api/Reparaciones/Search")]
        public IHttpActionResult SearchReparaciones(int id, bool orden)
        {
            if (id == 0)
            {
                //Retornamos las reparaciones con estado true
                var resultados = db.Reparacion.Where(x => x.estatus == true);
                if (orden == true)
                {
                    resultados = resultados.OrderBy(s => s.fecha);
                }
                else if (orden == false)
                {
                    resultados = resultados.OrderByDescending(s => s.fecha);
                }
                return Ok(resultados);
            }
            else
            {
                //Retornamos las reparaciones con estado true y que pertenezcan al usuario especificado
                var resultados = db.Reparacion.Where(x => x.estatus == true && x.Vehiculo.id_usuario == id);
                if (orden == true)
                {
                    resultados = resultados.OrderBy(s => s.fecha);
                }
                else if (orden == false)
                {
                    resultados = resultados.OrderByDescending(s => s.fecha);
                }
                return Ok(resultados);
            }
        }

        //Método para obtener las reparaciones por fecha
        // GET: api/Reparaciones/GetByDate/2019-01-01
        [HttpGet]
        [Route("api/Reparaciones/GetByDate")]
        public IHttpActionResult GetByDate(DateTime fecha)
        {
            var reparaciones = db.Reparacion.Where(x => x.fecha == fecha);
            return Ok(reparaciones);
        }

        // PUT: api/Reparaciones/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutReparacion(int id, Reparacion reparacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != reparacion.id)
            {
                return BadRequest();
            }

            try
            {
                // Verifica si la reparación existe
                var reparacionExistente = db.Reparacion.Find(id);
                if (reparacionExistente == null)
                {
                    return NotFound();
                }

                // Verifica si el vehículo existe y actualiza la relación
                if (reparacion.id_vehiculo != 0)
                {
                    var vehiculoExistente = db.Vehiculo.Find(reparacion.id_vehiculo);
                    if (vehiculoExistente == null)
                    {
                        return BadRequest("El vehículo especificado no existe.");
                    }

                    // Elimina la relación anterior si existe
                    if (reparacionExistente.Vehiculo != null)
                    {
                        reparacionExistente.Vehiculo = null;
                        db.Entry(reparacionExistente).State = EntityState.Modified;
                    }

                    // Actualiza la relación
                    db.Entry(vehiculoExistente).State = EntityState.Unchanged;

                    // Asigna el vehículo a la reparación
                    reparacionExistente.Vehiculo = vehiculoExistente;
                }
                else
                {
                    // Si id_vehiculo es null, elimina la relación
                    reparacionExistente.Vehiculo = null;
                }

                // Actualiza el resto de los campos de la reparación
                db.Entry(reparacionExistente).CurrentValues.SetValues(reparacion);
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ReparacionExists(id))
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

        // Método auxiliar para verificar si una reparación existe
        private bool ReparacionExists(int id)
        {
            return db.Reparacion.Count(e => e.id == id) > 0;
        }


        // POST: api/Reparaciones
        [ResponseType(typeof(Reparacion))]
        public IHttpActionResult PostReparacion(Reparacion reparacion)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Reparacion.Add(reparacion);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = reparacion.id }, reparacion);
        }

        // DELETE: api/Reparaciones/5
        [ResponseType(typeof(Reparacion))]
        public IHttpActionResult DeleteReparacion(int id)
        {
            Reparacion reparacion = db.Reparacion.Find(id);
            if (reparacion == null)
            {
                return NotFound();
            }

            //Cambiamos el estatus de la reparación a false
            reparacion.estatus = false;
            db.Entry(reparacion).State = EntityState.Modified;
            db.SaveChanges();

            return Ok(reparacion);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

    }
}
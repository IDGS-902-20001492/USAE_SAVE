using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
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
        private Model4 db = new Model4();

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

                try
                {
                    //si el historial no existe, lo creamos
                    var historial = db.Historial.Where(x => x.id_reparacion == reparacion.id).FirstOrDefault();
                    if (historial == null)
                    {
                        Historial nuevoHistorial = new Historial();
                        nuevoHistorial.id_reparacion = reparacion.id;
                        nuevoHistorial.id_vehiculo = reparacion.id_vehiculo;
                        db.Historial.Add(nuevoHistorial);
                    }
                    else
                    {
                        historial.id_vehiculo = reparacion.id_vehiculo;
                        db.Entry(historial).State = EntityState.Modified;
                    }
                }catch(Exception e)
                {
                    return BadRequest(e.Message);
                }


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

            //Guardamos la reparación en el historial
            Historial historial = new Historial();
            historial.id_reparacion = reparacion.id;
            historial.id_vehiculo = reparacion.id_vehiculo;
            db.Historial.Add(historial);

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

            try
            {
                //si el historial existe , lo eliminamos
                var historial = db.Historial.Where(x => x.id_reparacion == id).FirstOrDefault();
                Debug.WriteLine(historial.id_reparacion);
                if (historial != null)
                {
                    db.Historial.Remove(historial);
                    db.SaveChanges();
                    return Ok(reparacion);
                }
                else
                {
                    return BadRequest("El historial no existe");
                }
            }catch(Exception e)
            {
                return BadRequest(e.Message);
            }

            
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
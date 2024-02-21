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
    public class HistorialesController : ApiController
    {
        private Model4 db = new Model4();

        // GET: api/Historiales
        public IQueryable<Historial> GetHistorial()
        {
            return db.Historial;
        }

        // GET: api/Historiales/5
        [ResponseType(typeof(Historial))]
        public IHttpActionResult GetHistorial(int id)
        {
            Historial historial = db.Historial.Find(id);
            if (historial == null)
            {
                return NotFound();
            }

            return Ok(historial);
        }

        //GET para obtener los historiales agrupados por vehiculo
        // GET: api/Historiales/GetByGroup/5
        [HttpGet]
        [Route("api/Historiales/GetByGroup")]
        public IQueryable GetByGroup()
        {
            //Retornamos los historiales agrupados por vehiculo
            var resultados = db.Historial.GroupBy(x => x.id_vehiculo).Select(x => new { idVehiculo = x.Key, historiales = x });
            //Quitamos los nulos de los servicios y reparaciones
            foreach (var item in resultados)
            {
                foreach (var historial in item.historiales)
                {
                    if (historial.id_reparacion == null)
                    {
                        historial.Reparacion = new Reparacion();
                    }
                    if (historial.id_servicio == null)
                    {
                        historial.Servicio = new Servicio();
                    }
                }
            }
            return resultados;
        }


        //GET para obtener los historiales de un vehiculo
        //GET: api/Historiales/GetByCar/5
        [HttpGet]
        [Route("api/Historiales/GetByCar/{id}")]
        public IHttpActionResult GetByCar(int id)
        {
            try
            {
                //Obtener los historiales de un vehiculo
                var resultados = db.Historial
                    .Where(x => x.id_vehiculo == id)
                    .ToList();

                // Verificar si hay historiales para el vehículo
                if (resultados.Count == 0)
                {
                    return NotFound(); // Devolver 404 si no hay historiales
                }

                // Crear un objeto para almacenar el resultado final
                var resultadoFinal = new
                {
                    id_vehiculo = id,
                    servicios = resultados.Where(h => h.id_servicio != null).Select(h => h.Servicio).ToList(),
                    reparaciones = resultados.Where(h => h.id_reparacion != null).Select(h => h.Reparacion).ToList()
                };

                return Ok(resultadoFinal);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex); // Devolver 500 en caso de error
            }
        }



        // PUT: api/Historiales/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutHistorial(int id, Historial historial)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != historial.id)
            {
                return BadRequest();
            }

            db.Entry(historial).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HistorialExists(id))
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

        // POST: api/Historiales
        [ResponseType(typeof(Historial))]
        public IHttpActionResult PostHistorial(Historial historial)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Historial.Add(historial);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = historial.id }, historial);
        }

        // DELETE: api/Historiales/5
        [ResponseType(typeof(Historial))]
        public IHttpActionResult DeleteHistorial(int id)
        {
            Historial historial = db.Historial.Find(id);
            if (historial == null)
            {
                return NotFound();
            }

            db.Historial.Remove(historial);
            db.SaveChanges();

            return Ok(historial);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool HistorialExists(int id)
        {
            return db.Historial.Count(e => e.id == id) > 0;
        }
    }
}
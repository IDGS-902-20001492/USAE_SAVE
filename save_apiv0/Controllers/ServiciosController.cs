using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Helpers;
using System.Web.Http;
using System.Web.Http.Description;
using Microsoft.Ajax.Utilities;
using save_apiv0.Models;

namespace save_apiv0.Controllers
{
    public class ServiciosController : ApiController
    {
        private Model4 db = new Model4();

        // GET: api/Servicios
        public IQueryable<Servicio> GetServicio()
        {
           //retornando todos los servicios con estado true
            return db.Servicio.Where(x => x.estatus == true);
        }

        // GET: api/Servicios/5
        [ResponseType(typeof(Servicio))]
        public IHttpActionResult GetServicio(int id)
        {
            Servicio servicio = db.Servicio.Find(id);
            if (servicio == null)
            {
                return NotFound();
            }

            return Ok(servicio);
        }

        //Servicio para obtener los servicios basados en la id de una persona
        // GET: api/Servicios/Search/5
        [HttpGet]
        [Route("api/Servicios/Search")]
        public IHttpActionResult SearchServicios(int id, bool orden)
        {
            if (id == 0)
            {
                //Retornamos los servicios con estado true
                var resultados = db.Servicio.Where(x => x.estatus == true);
                if(orden == true)
                {
                    resultados = resultados.OrderBy(s => s.fechaProgramada);
                }
                else if(orden == false)
                {
                    resultados = resultados.OrderByDescending(s => s.fechaProgramada);
                }
                return Ok(resultados);
            }
            else
            {
                // Buscar coincidencias en varios campos y si orden es 0 no ordenar, si es 1 ordenar de forma ascendente y si es 2 ordenar de forma descendente
                var resultados = db.Servicio
                .Where(s =>
                           s.estatus == true &&
                                              s.Vehiculo.id_usuario == id);

                if (orden == true)
                {
                    resultados = resultados.OrderBy(s => s.fechaProgramada);
                }
                else if (orden == false)
                {
                    resultados = resultados.OrderByDescending(s => s.fechaProgramada);
                }

                return Ok(resultados);
            }
        }

        //Servicio para obtener los servicios de una fecha en especifico
        // GET: api/Servicios/SearchByDate/5
        [HttpGet]
        [Route("api/Servicios/SearchByDate")]
        public IHttpActionResult SearchServiciosByDate(DateTime fecha)
        {
            //Retornamos los servicios con estado true
            var resultados = db.Servicio.Where(x => x.estatus == true && x.fechaProgramada == fecha);
            return Ok(resultados);
        }

        // PUT: api/Servicios/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutServicio(int id, Servicio servicio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != servicio.id)
            {
                return BadRequest();
            }

            try
            {
                // Verifica si el servicio existe
                var servicioExistente = db.Servicio.Find(id);
                if (servicioExistente == null)
                {
                    return NotFound();
                }

                // Verifica si el vehículo existe y actualiza la relación
                if (servicio.id_vehiculo != 0)
                {
                    var vehiculoExistente = db.Vehiculo.Find(servicio.id_vehiculo);
                    if (vehiculoExistente == null)
                    {
                        return BadRequest("El vehículo especificado no existe.");
                    }

                    // Elimina la relación anterior si existe
                    if (servicioExistente.Vehiculo != null)
                    {
                        servicioExistente.Vehiculo = null;
                        db.Entry(servicioExistente).State = EntityState.Modified;
                    }

                    // Actualiza la relación
                    db.Entry(vehiculoExistente).State = EntityState.Unchanged;

                    // Asigna el vehículo al servicio
                    servicioExistente.Vehiculo = vehiculoExistente;
                }
                else
                {
                    // Si id_vehiculo es null, elimina la relación
                    servicioExistente.Vehiculo = null;
                }

                // Actualiza el resto de los campos del servicio
                db.Entry(servicioExistente).CurrentValues.SetValues(servicio);

                //Actualizamos el historial
                try
                {
                    //Si el historial no existe, lo creamos
                    if (db.Historial.Where(x => x.id_servicio == servicio.id).Count() == 0)
                    {
                        Historial historial = new Historial();
                        historial.id_servicio = servicio.id;
                        historial.id_vehiculo = servicio.id_vehiculo;
                        db.Historial.Add(historial);
                    }
                    else
                    {
                        //Si el historial existe, lo actualizamos
                        Historial historial = db.Historial.Where(x => x.id_servicio == servicio.id).First();
                        historial.id_vehiculo = servicio.id_vehiculo;
                        db.Entry(historial).State = EntityState.Modified;
                    }

                }
                catch (Exception e)
                {
                    return BadRequest(e.Message);
                }

                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServicioExists(id))
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

        // Método auxiliar para verificar si un servicio existe
        private bool ServicioExists(int id)
        {
            return db.Servicio.Count(e => e.id == id) > 0;
        }


        // POST: api/Servicios
        [ResponseType(typeof(Servicio))]
        public IHttpActionResult PostServicio(Servicio servicio)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Servicio.Add(servicio);
            

            //Guardamos el servicio en el historial
            Historial historial = new Historial();
            historial.id_servicio = servicio.id;
            historial.id_vehiculo = servicio.id_vehiculo;
            db.Historial.Add(historial);

            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = servicio.id }, servicio);
        }

        // DELETE: api/Servicios/5
        [ResponseType(typeof(Servicio))]
        public IHttpActionResult DeleteServicio(int id)
        {
            Servicio servicio = db.Servicio.Find(id);
            if (servicio == null)
            {
                return NotFound();
            }

            //Modificando el estado del servicio a false
            servicio.estatus = false;
            db.Entry(servicio).State = EntityState.Modified;
            db.SaveChanges();

            try
            {
                //Si el servicio existe en el historial, lo eliminamos
                if (db.Historial.Where(x => x.id_servicio == id).Count() > 0)
                {
                    Historial historial = db.Historial.Where(x => x.id_servicio == id).First();
                    db.Historial.Remove(historial);
                    db.SaveChanges();

                    return Ok(servicio);
                }
                else
                {
                    return BadRequest("El servicio no existe en el historial");
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
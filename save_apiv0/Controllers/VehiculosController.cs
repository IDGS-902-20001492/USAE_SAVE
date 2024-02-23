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
        private Model4 db = new Model4();

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

            try
            {
                // Verifica si el vehículo existe
                var vehiculoExistente = db.Vehiculo.Find(id);
                if (vehiculoExistente == null)
                {
                    return NotFound();
                }

                // Verifica si el usuario existe y actualiza la relación
                if (vehiculo.id_usuario != 0)
                {
                    var usuarioExistente = db.Usuario.Find(vehiculo.id_usuario);
                    if (usuarioExistente == null)
                    {
                        return BadRequest("El usuario especificado no existe.");
                    }

                    // Elimina la relación anterior si existe
                    if (vehiculoExistente.Usuario != null)
                    {
                        vehiculoExistente.Usuario = null;
                        db.Entry(vehiculoExistente).State = EntityState.Modified;
                    }

                    // Actualiza la relación
                    db.Entry(usuarioExistente).State = EntityState.Unchanged;

                    // Asigna el usuario al vehículo
                    vehiculoExistente.Usuario = usuarioExistente;
                }
                else
                {
                    // Si id_usuario es null, elimina la relación
                    vehiculoExistente.Usuario = null;
                }

                // Actualiza el resto de los campos del vehículo
                db.Entry(vehiculoExistente).CurrentValues.SetValues(vehiculo);
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

        //Metodo para actualizar unicamente el kilometraje de un vehiculo
        [HttpPut]
        [Route("api/Vehiculos/UpdateKilometraje")]
        public IHttpActionResult UpdateKilometraje(int id, int kilometraje)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                // Verifica si el vehículo existe
                var vehiculoExistente = db.Vehiculo.Find(id);
                if (vehiculoExistente == null)
                {
                    return NotFound();
                }

                //Si ya existe un registro con el id del vehiculo en HistorialKilometraje, lo actualizamos si no lo creamos
                var historialKilometraje = db.HistorialKilometraje.Where(x => x.vehiculoID == id).FirstOrDefault();
                if (historialKilometraje == null)
                {
                    HistorialKilometraje nuevoHistorial = new HistorialKilometraje();
                    nuevoHistorial.vehiculoID = id;
                    nuevoHistorial.kilometrajeAnterior = vehiculoExistente.kilometrajeRegistro;
                    nuevoHistorial.kilometrajeNuevo = kilometraje;
                    nuevoHistorial.fechaActualizacion = DateTime.Now;
                    nuevoHistorial.visto = false;
                    db.HistorialKilometraje.Add(nuevoHistorial);
                }
                else
                {
                    historialKilometraje.kilometrajeAnterior = vehiculoExistente.kilometrajeRegistro;
                    historialKilometraje.kilometrajeNuevo = kilometraje;
                    historialKilometraje.fechaActualizacion = DateTime.Now;
                    historialKilometraje.visto = false;
                    db.Entry(historialKilometraje).State = EntityState.Modified;
                }

                // Actualiza el kilometraje
                vehiculoExistente.kilometrajeRegistro = kilometraje;

                db.Entry(vehiculoExistente).State = EntityState.Modified;
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

        // Método auxiliar para verificar si un vehículo existe
        private bool VehiculoExists(int id)
        {
            return db.Vehiculo.Count(e => e.id == id) > 0;
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


            try
            {
                //Agregamos el historialKilometraje
                HistorialKilometraje nuevoHistorial = new HistorialKilometraje();
                nuevoHistorial.vehiculoID = vehiculo.id;
                nuevoHistorial.kilometrajeAnterior = vehiculo.kilometrajeRegistro;
                nuevoHistorial.kilometrajeNuevo = vehiculo.kilometrajeRegistro;
                nuevoHistorial.fechaActualizacion = DateTime.Now;
                nuevoHistorial.visto = false;
                db.HistorialKilometraje.Add(nuevoHistorial);
            } catch (Exception e)
            {
                return BadRequest(e.Message);
            }


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
    }
}
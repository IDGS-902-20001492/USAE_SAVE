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
            return db.Reparacion;
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

            db.Entry(reparacion).State = EntityState.Modified;

            try
            {
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

            db.Reparacion.Remove(reparacion);
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

        private bool ReparacionExists(int id)
        {
            return db.Reparacion.Count(e => e.id == id) > 0;
        }
    }
}
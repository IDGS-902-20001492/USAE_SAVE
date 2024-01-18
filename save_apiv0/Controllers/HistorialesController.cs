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
        private Model1 db = new Model1();

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
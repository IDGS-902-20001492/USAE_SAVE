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
    public class PiezasController : ApiController
    {
        private Model4 db = new Model4();

        // GET: api/Piezas
        public IQueryable<Pieza> GetPieza()
        {
            return db.Pieza;
        }

        // GET: api/Piezas/5
        [ResponseType(typeof(Pieza))]
        public IHttpActionResult GetPieza(int id)
        {
            Pieza pieza = db.Pieza.Find(id);
            if (pieza == null)
            {
                return NotFound();
            }

            return Ok(pieza);
        }

        // PUT: api/Piezas/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutPieza(int id, Pieza pieza)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != pieza.id)
            {
                return BadRequest();
            }

            db.Entry(pieza).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PiezaExists(id))
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

        // POST: api/Piezas
        [ResponseType(typeof(Pieza))]
        public IHttpActionResult PostPieza(Pieza pieza)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Pieza.Add(pieza);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = pieza.id }, pieza);
        }

        // DELETE: api/Piezas/5
        [ResponseType(typeof(Pieza))]
        public IHttpActionResult DeletePieza(int id)
        {
            Pieza pieza = db.Pieza.Find(id);
            if (pieza == null)
            {
                return NotFound();
            }

            db.Pieza.Remove(pieza);
            db.SaveChanges();

            return Ok(pieza);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool PiezaExists(int id)
        {
            return db.Pieza.Count(e => e.id == id) > 0;
        }
    }
}
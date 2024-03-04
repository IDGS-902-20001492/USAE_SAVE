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
    public class ImagenBannersController : ApiController
    {
        private Model1 db = new Model1();

        // GET: api/ImagenBanners
        public IQueryable<ImagenBanner> GetImagenBanner()
        {
            return db.ImagenBanner;
        }

        // GET: api/ImagenBanners/5
        [ResponseType(typeof(ImagenBanner))]
        public IHttpActionResult GetImagenBanner(int id)
        {
            ImagenBanner imagenBanner = db.ImagenBanner.Find(id);
            if (imagenBanner == null)
            {
                return NotFound();
            }

            return Ok(imagenBanner);
        }

        // GET: api/ImagenBanners/Exists/5
        [ResponseType(typeof(ImagenBanner))]
        [Route("api/ImagenBanners/Exists/{id}")]
        public IHttpActionResult GetImagenBannerExists(int id)
        {
            ImagenBanner imagenBanner = db.ImagenBanner.Find(id);
            if (imagenBanner == null)
            {
                return Ok(false);
            }
            else
            {
                return Ok(true);
            }
        }

        // PUT: api/ImagenBanners/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutImagenBanner(int id, ImagenBanner imagenBanner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != imagenBanner.id)
            {
                return BadRequest();
            }

            db.Entry(imagenBanner).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ImagenBannerExists(id))
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

        // POST: api/ImagenBanners
        [ResponseType(typeof(ImagenBanner))]
        public IHttpActionResult PostImagenBanner(ImagenBanner imagenBanner)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.ImagenBanner.Add(imagenBanner);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = imagenBanner.id }, imagenBanner);
        }

        // DELETE: api/ImagenBanners/5
        [ResponseType(typeof(ImagenBanner))]
        public IHttpActionResult DeleteImagenBanner(int id)
        {
            ImagenBanner imagenBanner = db.ImagenBanner.Find(id);
            if (imagenBanner == null)
            {
                return NotFound();
            }

            db.ImagenBanner.Remove(imagenBanner);
            db.SaveChanges();

            return Ok(imagenBanner);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool ImagenBannerExists(int id)
        {
            return db.ImagenBanner.Count(e => e.id == id) > 0;
        }
    }
}
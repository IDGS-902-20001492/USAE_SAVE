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
    public class UsuariosController : ApiController
    {
        private Model1 db = new Model1();

        // GET: api/Usuarios
        public IQueryable<Usuario> GetUsuario()
        {
            //Retornamos solo los usuarios con estatus 1
            return db.Usuario.Where(u => u.estatus == true);            
        }

        // GET: api/Usuarios/5
        [ResponseType(typeof(Usuario))]
        public IHttpActionResult GetUsuario(int id)
        {
            Usuario usuario = db.Usuario.Find(id);
            if (usuario == null)
            {
                return NotFound();
            }

            return Ok(usuario);
        }

        // GET: api/Usuarios/Search?query={cadena}
        [HttpGet]
        [Route("api/Usuarios/Search")]
        public IHttpActionResult SearchUsuarios(string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("La cadena de búsqueda no puede estar vacía");
            }

            // Buscar coincidencias en varios campos
            var resultados = db.Usuario
                .Where(u =>
                    u.estatus == true &&
                    (u.nombre.Contains(query) ||
                     u.apePaterno.Contains(query) ||
                     u.apeMaterno.Contains(query) ||
                     u.email.Contains(query)));

            return Ok(resultados);
        }


        // PUT: api/Usuarios/5
        [ResponseType(typeof(void))]
        public IHttpActionResult PutUsuario(int id, Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != usuario.id)
            {
                return BadRequest();
            }

            db.Entry(usuario).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UsuarioExists(id))
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

        // POST: api/Usuarios
        [ResponseType(typeof(Usuario))]
        public IHttpActionResult PostUsuario(Usuario usuario)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            db.Usuario.Add(usuario);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = usuario.id }, usuario);
        }

        // DELETE: api/Usuarios/5
        [ResponseType(typeof(Usuario))]
        public IHttpActionResult DeleteUsuario(int id)
        {
            Usuario usuario = db.Usuario.Find(id);
            if (usuario == null)
            {
                return NotFound();
            }
            else
            {
                //Cambiamos el estatus del usuario a 0
                usuario.estatus = false;
                db.Entry(usuario).State = EntityState.Modified;
                db.SaveChanges();
                return Ok(usuario);
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

        private bool UsuarioExists(int id)
        {
            return db.Usuario.Count(e => e.id == id) > 0;
        }
    }
}
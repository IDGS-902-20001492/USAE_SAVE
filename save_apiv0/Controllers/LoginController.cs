using save_apiv0.Models;
using System;
using System.Data.Entity.Core.Common.CommandTrees;
using System.Diagnostics;
using System.Linq;
using System.Web.Http;

namespace save_apiv0.Controllers
{
    public class LoginController : ApiController
    {
        private Model1 db = new Model1();

        //Autenticación de usuarios
        [HttpPost]
        [Route("api/login")]
        public IHttpActionResult Login(Usuario usuario)
        {
            try
            {
                //Buscamos el usuario en la base de datos
                var user = db.Usuario.Where(u => u.email == usuario.email && u.contrasena == usuario.contrasena).FirstOrDefault();
                if (user != null)
                {
                    return Ok(user);
                }
                else
                {
                    return BadRequest("Usuario o contraseña incorrectos");
                }
            }catch(Exception e)
            {
                Debug.WriteLine(e.Message);
                return BadRequest(e.Message);
            }
        }

        //Registro de usuarios
        [HttpPost]
        [Route("api/registro")]
        public IHttpActionResult Registro(Usuario usuario)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                //Agregamos el usuario a la base de datos si es que no existe
                if (!UsuarioExists(usuario.email))
                {
                    db.Usuario.Add(usuario);
                    db.SaveChanges();
                    return Ok(usuario);
                }
                else
                {
                    return BadRequest("El usuario ya existe");
                }
            }catch(Exception e)
            {
                Debug.WriteLine(e.Message);
                return BadRequest(e.Message);
            }

                
                

        }
        
        public bool UsuarioExists(string email)
        {
            if(db.Usuario.Count(u => u.email == email) > 0)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}

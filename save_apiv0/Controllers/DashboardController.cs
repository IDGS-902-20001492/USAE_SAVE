using save_apiv0.Models;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;

namespace save_apiv0.Controllers
{
    public class DashboardController : ApiController
    {
        private Model1 db = new Model1();

        // GET: api/Dashboard/Presupuesto
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Dashboard/PresupuestoPorMes/{mes}")]
        public IHttpActionResult PresupuestoPorMes(int mes)
        {
            try
            {
                // Obtenemos los vehículos con estatus true
                var vehiculos = db.Vehiculo.Where(v => v.estatus == true).ToList();

                // Obtenemos el presupuesto por mes de Servicios y Reparaciones
                var presupuesto = vehiculos.Select(v => new
                {
                    idVehiculo = v.id,
                    modeloVehiculo = v.modelo,
                    titularVehiculo = v.Usuario.nombre + " " + v.Usuario.apePaterno + " " + v.Usuario.apeMaterno,
                    presupuesto = (
                        from s in db.Servicio
                        where s.id_vehiculo == v.id && s.fechaProgramada.Month == mes && s.estatus == true
                        select (decimal?)s.presupuesto
                    ).Concat(
                        from r in db.Reparacion
                        where r.id_vehiculo == v.id && r.fecha.Month == mes && r.estatus == true
                        select (decimal?)r.presupuesto
                    ).Sum()
                });

                // Si el presupuesto es null, asignamos 0
                var presupuestoFinal = presupuesto.Select(p => new
                {
                    idVehiculo = p.idVehiculo,
                    modeloVehiculo = p.modeloVehiculo,
                    titularVehiculo = p.titularVehiculo,
                    presupuesto = p.presupuesto ?? 0
                });

                return Ok(presupuestoFinal);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        //Metodo para obtener la cantidad de servicios y reparaciones por mes agrupados por vehiculo
        // GET: api/Dashboard/Mantemiento/{mes}
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Dashboard/Mantenimiento/{mes}")]
        public IHttpActionResult Mantenimiento(int mes)
        {
            try
            {
                // Obtenemos los vehículos con estatus true
                var vehiculos = db.Vehiculo.Where(v => v.estatus == true).ToList();

                // Obtenemos la cantidad de servicios y reparaciones por mes
                var mantenimiento = vehiculos.Select(v => new
                {
                    idVehiculo = v.id,
                    modeloVehiculo = v.modelo,
                    titularVehiculo = v.Usuario.nombre + " " + v.Usuario.apePaterno + " " + v.Usuario.apeMaterno,
                    reparaciones = db.Reparacion.Where(r => r.id_vehiculo == v.id && r.fecha.Month == mes && r.estatus == true).Count(),
                    servicios = db.Servicio.Where(s => s.id_vehiculo == v.id && s.fechaProgramada.Month == mes && s.estatus == true).Count()
                });

                return Ok(mantenimiento);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        //Metodo para obtener de manera ascendente vehiculos con más kilometraje
        // GET: api/Dashboard/Kilometraje
        [System.Web.Http.HttpGet]
        [System.Web.Http.Route("api/Dashboard/Kilometraje")]
        public IHttpActionResult Kilometraje()
        {
            try
            {
                // Obtenemos los vehículos con estatus true
                var vehiculos = db.Vehiculo.Where(v => v.estatus == true).ToList();

                // Obtenemos los 5 vehículos con más kilometraje de la entidad Vehiculo
                var kilometraje = vehiculos.Select(v => new
                {
                    idVehiculo = v.id,
                    modeloVehiculo = v.modelo,
                    titularVehiculo = v.Usuario.nombre + " " + v.Usuario.apePaterno + " " + v.Usuario.apeMaterno,
                    kilometraje = v.kilometrajeRegistro
                }).OrderByDescending(v => v.kilometraje).Take(5);
                
               

                return Ok(kilometraje);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}
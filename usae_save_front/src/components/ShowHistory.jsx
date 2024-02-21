import { useEffect, useState } from "react";
import "./ShowHistory.css"
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const ShowHistory = () => {

    const [services, setServices] = useState([]);
    const [repairs, setRepairs] = useState([]);
    const [car, setCar] = useState([]);
    const [searched, setSearched] = useState(false);

    const monthSelect = document.getElementById("mes");

    const getServicesAndRepairs = async () => {

        const id = window.location.pathname.split("/")[2];

        const res = await fetch(`../api/Historiales/GetByCar/${id}`);
        const data = await res.json();
        setServices(data.servicios);
        setRepairs(data.reparaciones);
    }

    const getCarAttributes = async () => {
        const id = window.location.pathname.split("/")[2];
        const res = await fetch(`../api/Vehiculos/${id}`);
        const data = await res.json();
        setCar(data);
    }

    const sortDate = (fecha) => {
        //Cortamos la hora de un datetime
        if (fecha === null) {
            return "Sin fecha";
        } else {
            return fecha.slice(0, 10);
        }
    }

    const handleSelect = (e) => {
        if (e.target.value !== "0") {
            monthSelect.disabled = false;
        } else {
            monthSelect.disabled = true;
        }
    }

    const mostrarSweetAlert = () => {
        Swal.fire({
            title: "Advertencia",
            text: "Selecciona un mes y un año",
            icon: "warning",
            confirmButtonText: "Ok",
        });
    }

    //Funcion para filtrar los servicios y reparaciones por mes y año
    const filterByDate = (anio, mes) => {
        if (anio === "0") {
            mostrarSweetAlert();
        } else {
            //Si no se selecciona un mes mostramos de todos los meses de ese año
            if (mes === "0") {
                const res = services.filter((service) => {
                    return service.fechaProgramada.slice(0, 4) === anio;
                });
                setServices(res);
                const res2 = repairs.filter((repair) => {
                    return repair.fecha.slice(0, 4) === anio;
                });
                setRepairs(res2);
            } else {
                //Si se selecciona un mes y un año mostramos los servicios y reparaciones de ese mes y año
                const res = services.filter((service) => {
                    return service.fechaProgramada.slice(0, 4) === anio && service.fechaProgramada.slice(5, 7) === mes;
                });
                setServices(res);
                const res2 = repairs.filter((repair) => {
                    return repair.fecha.slice(0, 4) === anio && repair.fecha.slice(5, 7) === mes;
                });
                setRepairs(res2);
            }
            setSearched(true);
        }
    }

    const calculateBudgetServices = () => {
        let totalServicios = 0;
        services.forEach((service) => {
            totalServicios += service.presupuesto;
        });
        return totalServicios;
    }

    const calculateBudgetRepairs = () => {
        let totalReparaciones = 0;
        repairs.forEach((repair) => {
            totalReparaciones += repair.presupuesto;
        });
        return totalReparaciones;
    }


    useEffect(() => {
        getServicesAndRepairs();
        getCarAttributes();
    }, []);

    return (
        <div className="container-fluid fade-in">
            <div className="row mt-3 mb-2 text-center">
                <div className="col-2">
                    <Link to="/histories"
                        className="btn btn-secondary p-3"><i className="fas fa-arrow-left"></i>
                    </Link>
                </div>
                <div className="col-10">
                    <h1 className="text-white"><i className="fas fa-history"></i>
                        Historial de {car.modelo}</h1>
                </div>
            </div>
            <div className="container">
                <div className="row mb-2">
                    {
                        searched === false ? (
                            <>
                                <div className="col-md-4 mb-2">
                                    {
                                        <select className="form-select" aria-label="Default select example" id="mes" disabled>
                                            <option value="0">Selecciona un mes</option>
                                            <option value="01">Enero</option>
                                            <option value="02">Febrero</option>
                                            <option value="03">Marzo</option>
                                            <option value="04">Abril</option>
                                            <option value="05">Mayo</option>
                                            <option value="06">Junio</option>
                                            <option value="07">Julio</option>
                                            <option value="08">Agosto</option>
                                            <option value="09">Septiembre</option>
                                            <option value="10">Octubre</option>
                                            <option value="11">Noviembre</option>
                                            <option value="12">Diciembre</option>
                                        </select>
                                    }
                                </div>
                                {/*Select para seleccionar año*/}
                                <div className="col-md-4 mb-2">
                                    <select className="form-select" aria-label="Default select example" id="anio" onChange={handleSelect}>
                                        <option value="0">Selecciona un año</option>
                                        <option value="2022">2022</option>
                                        <option value="2023">2023</option>
                                        <option value="2024">2024</option>
                                        <option value="2025">2025</option>
                                        <option value="2026">2026</option>
                                        <option value="2027">2027</option>
                                        <option value="2028">2028</option>
                                        <option value="2029">2029</option>
                                        <option value="2030">2030</option>
                                    </select>
                                </div>
                                <div className="col-md-4 mb-2">
                                    <button className="btn btn-primary" onClick={() => {
                                        const mes = document.getElementById("mes").value;
                                        const anio = document.getElementById("anio").value;
                                        filterByDate(anio, mes);
                                    }}>Filtrar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-warning" style={{ width: "20%", marginLeft: "1em" }}
                                    onClick={() => {
                                        setSearched(false);
                                        getServicesAndRepairs();
                                    }}>Mostrar todo</button>
                            </>
                        )
                    }
                </div>
                <div className="row">
                    <div className="col-md-6 servicesView tabMovil">
                        <h3 className="text-white">Servicios</h3>
                        <table className="table table-striped table-bordered p-2">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Descripción</th>
                                    <th>Presupuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    services.length > 0 ? (
                                        <>
                                            {
                                                services.map((service) => (
                                                    <tr key={service.id}>
                                                        <td>{sortDate(service.fechaProgramada)}</td>
                                                        <td>{service.tipoServicio}</td>
                                                        <td>{service.descripcion}</td>
                                                        <td>${service.presupuesto}</td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <tr>
                                                <td colSpan="4">No hay servicios en esta fecha</td>
                                            </tr>
                                        </>
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="3"><b>Presupuesto total: </b></td>
                                    <td><b>${calculateBudgetServices()}</b></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="col-md-6 repairsView tabMovil2">
                        <h3 className="text-white">Reparaciones</h3>
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Fecha</th>
                                    <th>Tipo</th>
                                    <th>Descripción</th>
                                    <th>Conluido</th>
                                    <th>Presupuesto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    repairs.length > 0 ? (
                                        <>
                                            {
                                                repairs.map((repair) => (
                                                    <tr key={repair.id}>
                                                        <td>{sortDate(repair.fecha)}</td>
                                                        <td>{repair.tipoReparacion}</td>
                                                        <td>{repair.descripcion}</td>
                                                        <td>{repair.estatusReparacion === 1 ? "Si" : "No"}</td>
                                                        <td>${repair.presupuesto}</td>
                                                    </tr>
                                                ))
                                            }
                                        </>
                                    ) : (
                                        <>
                                            <tr>
                                                <td colSpan="5">No hay reparaciones en esta fecha</td>
                                            </tr>
                                        </>
                                    )
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan="4"><b>Presupuesto total:</b> </td>
                                    <td><b>${calculateBudgetRepairs()}</b></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ShowHistory
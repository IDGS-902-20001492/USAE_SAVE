import "./Repairs.css";
import { useEffect, useState } from "react"
import "./Users.css"
import Swal from "sweetalert2";

export const Repairs = () => {

    const [repairs, setRepairs] = useState([]);

    const [vehicles, setVehicles] = useState([]);

    const [users, setUsers] = useState([]);

    const [labelOrder, setLabelOrder] = useState("Reparaciones recientes");

    const [newRepair, setNewRepair] = useState({
        id: 0,
        fecha: "",
        fechaFin: "",
        tipoReparacion: "",
        descripcion: "",
        ubicacionReparacion: "",
        nombreMecanico: "",
        presupuesto: 0,
        estatus: true,
        estatusReparacion: 0
    });

    const [showModal, setShowModal] = useState(false);
    //Variable para determinar que botón se muestra en el modal
    const [modify, setModify] = useState(false);

    useEffect(() => {
        getRepairs();
        getVehicles();
        getUsers();
    }, []);

    const getRepairs = async () => {
        try {
            const res = await fetch("/api/Reparaciones");
            const data = await res.json();
            setRepairs(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getVehicles = async () => {
        try {
            const res = await fetch("/api/Vehiculos");
            const data = await res.json();
            setVehicles(data);
        } catch (error) {
            console.log(error);
        }
    }

    const getUsers = async () => {
        try {
            const res = await fetch("/api/Usuarios");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    const addRepair = async () => {
        try {

            await fetch("/api/Reparaciones", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRepair)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.ok === true) {
                    mostrarSweetAlert("Registro exitoso", "Reparación registrada correctamente", "success");
                    getRepairs();
                    //Limpiar formulario
                    setNewRepair({
                        id: 0,
                        fecha: "",
                        fechaFin: "",
                        tipoReparacion: "",
                        descripcion: "",
                        ubicacionReparacion: "",
                        nombreMecanico: "",
                        presupuesto: 0,
                        estatus: true,
                        estatusReparacion: 0
                    });
                    closeModal();

                } else {
                    //Impresión de error en consola
                    console.log(response);
                    mostrarSweetAlert("Error", "La reparación no se pudo registrar", "error");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const editRepair = async () => {
        try {
            await fetch(`/api/Reparaciones/${newRepair.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRepair)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.ok === true) {
                    mostrarSweetAlert("Modificación exitosa", "Reparación modificada correctamente", "success");
                    getRepairs();
                    //Limpiar formulario
                    setNewRepair({
                        id: 0,
                        fecha: "",
                        fechaFin: "",
                        tipoReparacion: "",
                        descripcion: "",
                        ubicacionReparacion: "",
                        nombreMecanico: "",
                        presupuesto: 0,
                        estatus: true,
                        estatusReparacion: 0
                    });
                    closeModal();

                } else {
                    //Impresión de error en consola
                    console.log(response);
                    mostrarSweetAlert("Error", "La reparación no se pudo modificar", "error");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const deleteRepair = async (id) => {
        try {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "La reparación se eliminará.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/api/Reparaciones/${id}`, {
                        method: "DELETE",
                    }).catch((error) => {
                        console.log(error);
                    }).then((response) => {
                        if (response.ok === true) {
                            Swal.fire(
                                "¡Eliminado!",
                                "Reparación eliminada.",
                                "success"
                            );
                            getRepairs();
                        } else {
                            //Impresión de error en consola
                            console.log(response);
                            mostrarSweetAlert("Error", "El usuario no se pudo eliminar", "error");
                        }
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    Swal.fire(
                        "Cancelado",
                        "Eliminación cancelada",
                        "Success"
                    );
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const sortDate = (fecha) => {
        //Cortamos la hora de un datetime
        return fecha.slice(0, 10);
    }

    const changeRepairStatus = async (id) => {
        try {
            const res = await fetch(`/api/Reparaciones/${id}`);
            const data = await res.json();
            data.estatusReparacion = data.estatusReparacion === 0 ? 1 : 0;
            await fetch(`/api/Reparaciones/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.ok === true) {
                    mostrarSweetAlert("Modificación exitosa", "Reparación modificada correctamente", "success");
                    getRepairs();
                } else {
                    //Impresión de error en consola
                    console.log(response);
                    mostrarSweetAlert("Error", "La reparación no se pudo modificar", "error");
                }
            });
        } catch (error) {
            console.log(error);
        }
    }


    const mostrarSweetAlert = (title, text, icon) => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: "Ok",
        });
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewRepair({
            ...newRepair,
            [name]: value,
        });
    };

    const filterService = async () => {
        const idUsuario = document.getElementById("buscar").value;
        const orden = document.getElementById("order").checked;

        if (orden) {
            setLabelOrder("Servicios más antiguos");
        } else {
            setLabelOrder("Servicios más recientes");
        }

        if (idUsuario === "Filtrar por persona") {
            getRepairs();
        } else {
            try {
                const res = await fetch(`/api/Reparaciones/Search?id=${idUsuario}&&orden=${orden}`);
                const data = await res.json();
                setRepairs(data);
            } catch (error) {
                console.log(error);
            }
        }

    }

    const handleOrder = async () => {
        const orden = document.getElementById("order").checked;

        if (orden) {
            if (document.getElementById("buscar").value === "Filtrar por persona") {
                let res = await fetch(`/api/Reparaciones/Search?id=${0}&&orden=${orden}`);
                let data = await res.json();
                setLabelOrder("Reparaciones antiguas");
                setRepairs(data);
            } else {
                filterService();
            }
        } else {
            if (document.getElementById("buscar").value === "Filtrar por persona") {
                let res = await fetch(`/api/Reparaciones/Search?id=${0}&&orden=${orden}`);
                let data = await res.json();
                setLabelOrder("Reparaciones recientes");
                setRepairs(data);
            } else {
                filterService();
            }
        }
    }

    const findByDate = async (e) => {
        const fecha = e.target.value;

        if (fecha === "") {
            getRepairs();
        } else {
            try {
                const res = await fetch(`/api/Reparaciones/GetByDate?fecha=${fecha}`);
                const data = await res.json();
                setRepairs(data);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const openModal = () => {
        setShowModal(true);
        setModify(false);
    };

    const modifyModal = async (id) => {
        setShowModal(true);
        setModify(true);
        //Ponemos los datos del usuario en el formulario
        try {
            const res = await fetch(`/api/Reparaciones/${id}`);
            const data = await res.json();
            data.fecha = data.fecha.slice(0, 10);
            data.fechaFin = data.fechaFin.slice(0, 10);
            setNewRepair(data);
        } catch (error) {
            console.log(error);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        //Limpiamos el formulario
        setNewRepair({
            id: 0,
            fecha: "",
            fechaFin: "",
            tipoReparacion: "",
            descripcion: "",
            observaciones: "",
            ubicacionReparacion: "",
            nombreMecanico: "",
            presupuesto: 0,
            estatus: true,
            estatusReparacion: 0,
            id_vehiculo: 0
        });
    };

    return (
        <div className="fluid-content noS">
            <h1 className="text-center text-white"><i className="fa-solid fa-toolbox"></i> Reparaciones</h1>
            <div className="row">
                <div className="col-4 user-select">
                    <div className="input-group mb-3">
                        <select className="form-select" aria-label="Default select example" id="buscar" onChange={filterService}>
                            <option defaultValue>Filtrar por persona</option>
                            {
                                users.map((user) => (
                                    <option key={user.id} value={user.id}>{user.nombre} {user.apePaterno} {user.apeMaterno}</option>
                                ))
                            }
                        </select>
                    </div>
                </div>
                <div className="col-2 sw-mobile">
                    <div className="row ms-1">
                        <div className="col-2">
                            <div className="input-group">
                                <div className="form-check form-switch">
                                    <input className="form-check-input fs-4" type="checkbox" id="order" name="order" onChange={handleOrder} />
                                </div>
                            </div>
                        </div>
                        <div className="col-10">
                            <label className="form-check-label text-white me-3" htmlFor="flexSwitchCheckDefault">{labelOrder}</label>
                        </div>
                    </div>
                </div>
                <div className="col-4 ">
                    <div className="row date-mobile">
                        <div className="col-8">
                            <div className="input-group">
                                <input type="date" className="form-control" id="buscarFecha" name="buscarFecha" onChange={findByDate} />
                            </div>
                        </div>
                        <div className="col-4">
                            <label htmlFor="buscarFecha" className="form-label text-white">Buscar por fecha</label>
                        </div>
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button className="btn btn-primary me-md-2 escritorio-add" type="button" onClick={openModal} >
                            <i className="fas fa-plus"></i> Añadir Reparación
                        </button>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-2">
                    <button className="btn btn-primary me-md-2 movil-add" type="button" onClick={openModal} >
                        <i className="fas fa-plus"></i>Agregar
                    </button>
                </div>
            </div>

            <div className="row">
                <div id="escritorioUsers" className="col-md-12">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Fechas</th>
                                <th>Tipo de reparación</th>
                                <th>Ubicación</th>
                                <th>Descripción</th>
                                <th>Observaciones</th>
                                <th>Mecánico</th>
                                <th>Presupuesto</th>
                                <th>Vehiculo</th>
                                <th>Encargado principal</th>
                                <th>Reparación Concluida</th>
                                <th>Editar</th>
                                <th>Borrar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                repairs.map((rep) => (
                                    <tr key={rep.id}>
                                        <td>
                                            <div className="row">
                                                <div className="col-12">
                                                    <p><i className="fas fa-wrench"></i><b>Inicio:</b> {sortDate(rep.fecha)}</p>
                                                </div>
                                                <div className="col-12">
                                                    <p><i className="fas fa-wrench"></i><b>Fin:</b> {sortDate(rep.fechaFin)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{rep.tipoReparacion}</td>
                                        <td>{rep.descripcion}</td>
                                        <td>{rep.ubicacionReparacion}</td>
                                        <td>{rep.observaciones}</td>
                                        <td>{rep.nombreMecanico}</td>
                                        <td>${rep.presupuesto}</td>
                                        <td>{rep.Vehiculo.modelo}</td>
                                        <td>{rep.Vehiculo.Usuario.nombre} {rep.Vehiculo.Usuario.apePaterno}{rep.Vehiculo.Usuario.apematerno}</td>
                                        <td>{
                                            rep.estatusReparacion === 0 ?
                                                <p>
                                                    <i className="fas fa-times"></i>No
                                                    <button className="btn btn-secondary ms-1" onClick={() => changeRepairStatus(rep.id)} title="Concluir/Cambiar reparación">
                                                        <i className="fa-solid fa-arrows-rotate"></i>
                                                    </button>
                                                </p>
                                                :
                                                <p>
                                                    <i className="fas fa-check"></i>Si
                                                    <button className="btn btn-secondary ms-1" onClick={() => changeRepairStatus(rep.id)} title="Concluir/Cambiar reparación">
                                                        <i className="fa-solid fa-arrows-rotate"></i>
                                                    </button>
                                                </p>
                                        }</td>
                                        <td>
                                            <button className="btn btn-success" onClick={
                                                () => {
                                                    modifyModal(rep.id);
                                                }
                                            }>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger"
                                                onClick={
                                                    () => {
                                                        deleteRepair(rep.id);
                                                    }
                                                }>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                </div>
                {/*Creamos cards para la versión movil*/}
                <div id="movilUsers" className="col-md-12">
                    {
                        repairs.map((rep) => (
                            <div className="card mt-2" key={rep.id}>
                                <div className="card-body shadow rounded">
                                    <div className="row">
                                        <div className="col-4">
                                            <div>
                                                <img src="/img/repair.png" className="min_repair" />
                                            </div>
                                        </div>
                                        <div className="col-8">
                                            <h5 className="card-title">{rep.Vehiculo.modelo}</h5>
                                            <p className="card-text">{rep.Vehiculo.Usuario.nombre} {rep.Vehiculo.Usuario.apePaterno} {rep.Vehiculo.Usuario.apeMaterno}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-12">
                                            {/*Ponemos todos los datos de la reparacion*/}
                                            <p><i className="fas fa-wrench"></i><b>Inicio:</b> {sortDate(rep.fecha)}</p>
                                            <p><i className="fas fa-wrench"></i><b>Fin:</b> {sortDate(rep.fechaFin)}</p>
                                            <p><i className="fas fa-tools"></i><b>Tipo de reparación:</b> {rep.tipoReparacion}</p>
                                            <p><i className="fas fa-map-marker-alt"></i><b>Ubicación:</b> {rep.ubicacionReparacion}</p>
                                            <p><i className="fas fa-file-alt"></i><b>Descripción:</b> {rep.descripcion}</p>
                                            <p><i className="fas fa-eye"></i><b>Observaciones:</b> {rep.observaciones}</p>
                                            <p><i className="fas fa-user"></i><b>Mecánico:</b> {rep.nombreMecanico}</p>
                                            <p><i className="fas fa-dollar-sign"></i><b>Presupuesto:</b> ${rep.presupuesto}</p>
                                            <p><i className="fas fa-check"></i><b>Reparación Concluida:</b> {
                                                rep.estatusReparacion === 0 ? "No" : "Si"
                                            }</p>
                                        </div>

                                    </div>
                                    <div className="row">
                                        <div className="col-4">
                                            <button className="btn btn-secondary w-100 mt-2" onClick={() => changeRepairStatus(rep.id)}>
                                                <i className="fa-solid fa-arrows-rotate"> </i>{
                                                    rep.estatusReparacion === 0 ? "Concluir" : "Reabrir"
                                                }
                                            </button>
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-success w-100 mt-2" onClick={
                                                () => {
                                                    modifyModal(rep.id);
                                                }
                                            }>
                                                <i className="fas fa-edit"> </i>Editar
                                            </button>
                                        </div>
                                        <div className="col-4">
                                            <button className="btn btn-danger w-100 mt-2"
                                                onClick={
                                                    () => {
                                                        deleteRepair(rep.id);
                                                    }
                                                }>
                                                <i className="fas fa-trash-alt"> </i>Eliminar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
            {/*Creamos un div modal*/}
            <div
                className={`modal fade ${showModal ? "show" : ""}`}
                id="modalAddUser" tabIndex="-1" role="dialog"
                style={{ display: showModal ? "block" : "none" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {
                                    modify ? "Modificar reparación" : "Agregar reparación"
                                }
                            </h5>
                            <button
                                type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Formulario */}
                            <div className="row">
                                <div className="col-6 mb-1">
                                    <label htmlFor="fecha" className="form-label">Fecha de reparación</label>
                                    <input type="date" className="form-control" id="fecha" name="fecha" value={newRepair.fecha} onChange={handleInputChange} />
                                </div>
                                <div className="col-6 mb-1">
                                    <label htmlFor="fechaFin" className="form-label">Fecha de fin(estimada)</label>
                                    <input type="date" className="form-control" id="fechaFin" name="fechaFin" value={newRepair.fechaFin} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-1">
                                    <label htmlFor="tipoReparacion" className="form-label">Tipo de Reparación</label>
                                    <select className="form-select" id="tipoReparacion" name="tipoReparacion" value={newRepair.tipoReparacion} onChange={handleInputChange}>
                                        <option value="">Selecciona un tipo de reparación</option>
                                        <option value="Mecánica">Mecánica</option>
                                        <option value="Eléctrica">Eléctrica</option>
                                        <option value="Carrocería">Carrocería</option>
                                        <option value="Pintura">Pintura</option>
                                    </select>
                                </div>
                                <div className="col-6">
                                    <label htmlFor="presupuesto" className="form-label">Presupuesto</label>
                                    <input type="number" className="form-control" id="presupuesto" name="presupuesto" value={newRepair.presupuesto} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-1">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" id="descripcion" name="descripcion" value={newRepair.descripcion} onChange={handleInputChange} />
                                </div>
                                <div className="col-6 mb-1">
                                    <label htmlFor="observaciones" className="form-label">Observaciones</label>
                                    <textarea className="form-control" id="observaciones" name="observaciones" value={newRepair.observaciones} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-1">
                                    <label htmlFor="ubicacionReparacion" className="form-label">Ubicación de Reparación</label>
                                    <input type="text" className="form-control" id="ubicacionReparacion" name="ubicacionReparacion" value={newRepair.ubicacionReparacion} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-1">
                                    <label htmlFor="nombreMecanico" className="form-label">Mecánico</label>
                                    <input type="text" className="form-control" id="nombreMecanico" name="nombreMecanico" value={newRepair.nombreMecanico} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-1">
                                    <label htmlFor="id_vehiculo" className="form-label">Vehiculo</label>
                                    <select className="form-select" id="id_vehiculo" name="id_vehiculo" value={newRepair.id_vehiculo} onChange={handleInputChange}>
                                        <option value="0">Selecciona un vehiculo</option>
                                        {
                                            vehicles.map((vehicle) => (
                                                <option key={vehicle.id} value={vehicle.id}>{vehicle.modelo} - {vehicle.Usuario.nombre} {vehicle.Usuario.apePaterno} {vehicle.Usuario.apeMaterno}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* Botón para agregar usuario o modificar usuario*/}
                            {
                                modify ?
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            editRepair();
                                        }
                                    }>Modificar</button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            addRepair();
                                        }
                                    }>Agregar</button>
                            }

                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={closeModal}>Cerrar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

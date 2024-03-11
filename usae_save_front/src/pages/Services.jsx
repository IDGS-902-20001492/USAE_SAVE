import { useEffect, useState } from "react"
import "./Users.css"
import "./Services.css"
import Swal from "sweetalert2";
import { API_URL } from "../Api_url";

export const Services = () => {

    const [services, setServices] = useState([]);

    const [newService, setNewService] = useState({
        id: 0,
        fechaProgramada: "",
        kilometrajeServicio: 0,
        tipoServicio: "",
        telefono: "",
        ubicacionServicio: "",
        mecanico: "",
        descripcion: "",
        presupuesto: 0,
        id_vehiculo: 0,
        estatus: true,
        estatusServicio: false
    });

    const [showModal, setShowModal] = useState(false);
    //Variable para determinar que botón se muestra en el modal
    const [modify, setModify] = useState(false);

    const [vehicles, setVehicles] = useState([]);

    const [users, setUsers] = useState([]);

    const [labelOrder, setLabelOrder] = useState("Servicios más recientes");

    useEffect(() => {
        getServices();
        getVehicles();
        getUsers();
    }, []);

    const getServices = async () => {
        try {
            const res = await fetch(API_URL + "/api/Servicios");
            const data = await res.json();
            if (localStorage.getItem("level") === "2") {
                setServices(data);
            } else {
                const serv = data.filter((serv) => serv.Vehiculo.Usuario.id === parseInt(localStorage.getItem("id")));
                setServices(serv);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const getVehicles = async () => {
        try {
            const res = await fetch(API_URL + "/api/Vehiculos");
            const data = await res.json();
            if (localStorage.getItem("level") === "2") {
                setVehicles(data);
            } else {
                const veh = data.filter((veh) => veh.id_usuario === parseInt(localStorage.getItem("id")));
                setVehicles(veh);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const getUsers = async () => {
        try {
            const res = await fetch(API_URL + "/api/Usuarios");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    };

    const addService = async () => {
        try {
            if (validateFields() === false) {
                let camposVacios = "";
                for (const key in newService) {
                    if (newService[key] === "") {
                        camposVacios += `${key}, `;
                    }
                }
                if (newService.id_vehiculo === 0) {
                    camposVacios += "Vehículo, ";
                }
                mostrarSweetAlert("Error", "Los siguientes campos están vacíos: " + camposVacios, "error");
                return;
            } else {
                await fetch(API_URL + "/api/Servicios", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newService)
                }).catch((error) => {
                    console.log(error);
                }).then((response) => {
                    if (response.ok === true) {
                        mostrarSweetAlert("Registro exitoso", "El servicio se registró correctamente", "success");
                        getServices();
                        //Limpiar formulario
                        setNewService({
                            id: 0,
                            fechaProgramada: "",
                            kilometrajeServicio: 0,
                            tipoServicio: "",
                            telefono: "",
                            ubicaciónServicio: "",
                            mecanico: "",
                            descripcion: "",
                            presupuesto: "",
                            id_vehiculo: 0,
                            estatus: true
                        });
                        closeModal();

                    } else {
                        //Impresión de error en consola
                        console.log(response);
                        mostrarSweetAlert("Error", "El servicio no se pudo registrar", "error");
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const editService = async () => {
        try {
            if (validateFields() === false) {
                let camposVacios = "";
                for (const key in newService) {
                    if (newService[key] === "") {
                        camposVacios += `${key}, `;
                    }
                }
                mostrarSweetAlert("Error", "Los siguientes campos están vacíos: " + camposVacios, "error");
                return;
            } else {
                await fetch(API_URL + `/api/Servicios/${newService.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(newService)
                }).catch((error) => {
                    console.log(error);
                }).then((response) => {
                    if (response.ok === true) {
                        mostrarSweetAlert("Modificación exitosa", "El servició se modificó correctamente", "success");
                        getServices();
                        //Limpiar formulario
                        setNewService({
                            id: 0,
                            fechaProgramada: "",
                            kilometrajeServicio: 0,
                            tipoServicio: "",
                            telefono: "",
                            ubicaciónServicio: "",
                            mecanico: "",
                            descripcion: "",
                            presupuesto: "",
                            id_vehiculo: 0,
                            estatus: true
                        });
                        closeModal();

                    } else {
                        //Impresión de error en consola
                        console.log(response);
                        mostrarSweetAlert("Error", "El servicio no se pudo modificar", "error");
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const changeServiceStatus = async (service) => {
        try {

            if (service.estatusServicio === true) {
                service.estatusServicio = false;
            } else {
                service.estatusServicio = true;
            }

            const res = await fetch(API_URL + `/api/Servicios/${service.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(service)
            });

            if (res.ok === true) {
                mostrarSweetAlert("Servicio concluido", "Estatus de servicio cambiado", "success");
                getServices();
            } else {
                //Impresión de error en consola
                console.log(res);
                mostrarSweetAlert("Error", "El servicio no se pudo concluir", "error");
            }

        } catch (error) {
            console.log(error);
        }
    }

    const deleteService = async (id) => {
        try {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "El servicio se eliminará.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(API_URL + `/api/Servicios/${id}`, {
                        method: "DELETE",
                    }).catch((error) => {
                        console.log(error);
                    }).then((response) => {
                        if (response.ok === true) {
                            Swal.fire(
                                "Eliminado",
                                "El servicio ha sido borrado.",
                                "success"
                            );
                            getServices();
                        } else {
                            //Impresión de error en consola
                            console.log(response);
                            mostrarSweetAlert("Error", "El servicio no se pudo eliminar", "error");
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

    const filterService = async () => {
        const idUsuario = document.getElementById("buscar").value;
        const orden = document.getElementById("order").checked;

        if (orden) {
            setLabelOrder("Servicios más antiguos");
        } else {
            setLabelOrder("Servicios más recientes");
        }

        if (idUsuario === "Filtrar por persona") {
            getServices();
        } else {
            try {
                const res = await fetch(API_URL + `/api/Servicios/Search?id=${idUsuario}&&orden=${orden}`);
                const data = await res.json();
                setServices(data);
            } catch (error) {
                console.log(error);
            }
        }

    }

    const handleOrder = async () => {
        const orden = document.getElementById("order").checked;

        if (orden) {
            if (document.getElementById("buscar").value === "Filtrar por persona") {

                if (localStorage.getItem("level") === "2") {
                    let res = await fetch(API_URL + `/api/Servicios/Search?id=${0}&&orden=${orden}`);
                    let data = await res.json();
                    setLabelOrder("Servicios más antiguos");
                    setServices(data);
                } else {
                    let idUser = parseInt(localStorage.getItem("id"));
                    let res = await fetch(API_URL + `/api/Servicios/Search?id=${idUser}&&orden=${orden}`);
                    let data = await res.json();
                    setLabelOrder("Servicios más antiguos");
                    setServices(data);
                }
            } else {
                filterService();
            }
        } else {
            if (document.getElementById("buscar").value === "Filtrar por persona") {

                if (localStorage.getItem("level") === "2") {
                    let res = await fetch(API_URL + `/api/Servicios/Search?id=${0}&&orden=${orden}`);
                    let data = await res.json();
                    setLabelOrder("Servicios más recientes");
                    setServices(data);
                } else {
                    let idUser = parseInt(localStorage.getItem("id"));
                    let res = await fetch(API_URL + `/api/Servicios/Search?id=${idUser}&&orden=${orden}`);
                    let data = await res.json();
                    setLabelOrder("Servicios más recientes");
                    setServices(data);
                }
            } else {
                filterService();
            }
        }
    }

    const findByDate = async (e) => {
        const fecha = e.target.value;

        if (fecha === "") {
            getServices();
        } else {
            try {
                const res = await fetch(API_URL + `/api/Servicios/SearchByDate?fecha=${fecha}`);
                const data = await res.json();
                if (localStorage.getItem("level") === "2") {
                    setServices(data);
                } else {
                    const serv = data.filter((serv) => serv.Vehiculo.Usuario.id === parseInt(localStorage.getItem("id")));
                    setServices(serv);
                }
            } catch (error) {
                console.log(error);
            }
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
        setNewService({
            ...newService,
            [name]: value,
        });
    };

    const handleSelectChange = (e) => {
        const { value } = e.target;
        const kilometraje = encontrarKilometraje(value);
        setNewService({
            ...newService,
            id_vehiculo: value,
            kilometrajeServicio: kilometraje
        });
    };

    const validateFields = () => {
        if (newService.id_vehiculo === 0 || newService.fechaProgramada === "" || newService.kilometrajeServicio === 0 || newService.tipoServicio === "" || newService.ubicacionServicio === "" || newService.mecanico === "" || newService.presupuesto === 0) {
            return false;
        } else {
            return true;
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
            const res = await fetch(API_URL + `/api/Servicios/${id}`);
            const data = await res.json();

            //Le quitamos la hora al datetiem original para que se muestre en el input
            data.fechaProgramada = sortDate(data.fechaProgramada);
            setNewService(data);
        } catch (error) {
            console.log(error);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        //Limpiamos el formulario
        setNewService({
            id: 0,
            fechaProgramada: "",
            kilometrajeServicio: 0,
            tipoServicio: "",
            telefono: "",
            ubicacionServicio: "",
            mecanico: "",
            descripcion: "",
            presupuesto: "",
            id_vehiculo: 0,
            estatus: true
        });
    };

    const encontrarKilometraje = (id) => {
        const vehiculo = vehicles.find((veh) => veh.id === parseInt(id));
        return vehiculo.kilometrajeRegistro;
    }

    const sortDate = (fecha) => {
        //Cortamos la hora de un datetime
        return fecha.slice(0, 10);
    }

    return (
        <div className="fluid-content noS fade-in">
            <h1 className="text-center text-white"><i className="fa-solid fa-screwdriver-wrench"></i> Servicios</h1>
            <div className="row">
                <div className="col-4 user-select">
                    {
                        localStorage.getItem("level") === "2" ? (
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
                        ) : (
                            <>
                                <div className="input-group mb-3">
                                    <select className="form-select" aria-label="Default select example" id="buscar" onChange={filterService} hidden>
                                        <option defaultValue>Filtrar por persona</option>
                                        {
                                            users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.nombre} {user.apePaterno} {user.apeMaterno}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </>
                        )
                    }

                </div>
                <div className="col-2 sw-mobile mb-3">
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
                <div className="col-4 mb-3">
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
                <div className="col-2">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button className="btn btn-primary me-md-2 escritorio-add" type="button" onClick={openModal} >
                            <i className="fas fa-plus"></i>
                            Agregar servicio
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
                                <th>Fecha Programada</th>
                                <th>Kilometraje de servicio</th>
                                <th>Tipo de Servicio</th>
                                <th>Dirección</th>
                                <th>Mecánico/Taller</th>
                                <th>Descripción</th>
                                <th>Presupuesto</th>
                                <th>Vehiculo</th>
                                <th>Principal</th>
                                <th>Terminado</th>
                                <th>Editar</th>
                                <th>Borrar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                services.length > 0 ? (
                                    services.map((serv) => (
                                        <tr key={serv.id}>
                                            <td>{sortDate(serv.fechaProgramada)}</td>
                                            <td>{serv.kilometrajeServicio} km</td>
                                            <td>{serv.tipoServicio}</td>
                                            <td>{serv.ubicacionServicio}</td>
                                            <td>{serv.mecanico}</td>
                                            <td>{
                                                serv.descripcion === null || serv.descripcion === "" ? "Sin descripción" : serv.descripcion
                                            }</td>
                                            <td>${serv.presupuesto}</td>
                                            <td>{serv.Vehiculo.modelo}</td>
                                            <td>{serv.Vehiculo.Usuario.nombre} {serv.Vehiculo.Usuario.apePaterno} {serv.Vehiculo.Usuario.apeMaterno}</td>
                                            <td>{
                                                serv.estatusServicio ?
                                                    <button className="btn btn-secondary" onClick={
                                                        () => {
                                                            changeServiceStatus(serv);
                                                        }
                                                    }>
                                                        <i className="fas fa-check"></i>
                                                    </button>
                                                    :
                                                    <button className="btn btn-secondary" onClick={
                                                        () => {
                                                            changeServiceStatus(serv);
                                                        }
                                                    }>
                                                        <i className="fas fa-times"></i>
                                                    </button>
                                            }</td>
                                            <td>
                                                <button className="btn btn-success" onClick={
                                                    () => {
                                                        modifyModal(serv.id);
                                                    }
                                                }>
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger"
                                                    onClick={
                                                        () => {
                                                            deleteService(serv.id);
                                                        }
                                                    }>
                                                    <i className="fas fa-trash-alt"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="12" className="text-center"><i className="fas fa-exclamation-triangle"></i>No hay servicios registrados para esa fecha ó persona.</td>
                                    </tr>
                                )

                            }
                        </tbody>
                    </table>
                </div>
                {/*Creamos cards para la versión movil*/}
                <div id="movilUsers" className="col-md-12">
                    {
                        services.length > 0 ? (
                            services.map((serv) => (
                                <div className="card mt-2" key={serv.id}>
                                    <div className="card-body shadow rounded">
                                        <div className="row">
                                            <div className="col-6">
                                                <div className="text-center">
                                                    {
                                                        serv.Vehiculo.imagen === null ?
                                                            <img src="/img/coche.png" className="img-fluid rounded" alt="Imagen de usuario" />
                                                            :
                                                            <img src={serv.Vehiculo.imagen} className="img-fluid rounded" alt="Imagen de usuario" />
                                                    }
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <h5 className="card-title">{serv.Vehiculo.modelo}</h5>
                                                <p className="card-text">{serv.Vehiculo.Usuario.nombre} {serv.Vehiculo.Usuario.apePaterno} {serv.Vehiculo.Usuario.apeMaterno}</p>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <p className="card-text"><b>Kilometraje al momento del servicio:</b> {serv.kilometrajeServicio} km</p>
                                                <p className="card-text"><b>Tipo de servicio:</b> {serv.tipoServicio}</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="card-text"><b>Dirección de servicio:</b> {serv.ubicacionServicio}</p>
                                                <p className="card-text"><b>Mecánico ó taller:</b> {serv.mecanico}</p>
                                            </div>
                                        </div>
                                        <div className="row mt-2">
                                            <div className="col-6">
                                                <p className="card-text"><b>Presupuesto:</b> ${serv.presupuesto}</p>
                                            </div>
                                            <div className="col-6">
                                                <p className="card-text"><b>Fecha programada:</b> {sortDate(serv.fechaProgramada)}</p>
                                            </div>
                                        </div>

                                        <div className="row mt-2">
                                            <div className="col-12">
                                                <p className="card-text"><b>Descripción:</b> {
                                                    serv.descripcion === null ? "Sin descripción" : serv.descripcion
                                                }</p>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-4">
                                                {
                                                    serv.estatusServicio ?
                                                        <button className="btn btn-secondary w-100 mt-2" onClick={
                                                            () => {
                                                                changeServiceStatus(serv);
                                                            }
                                                        }>
                                                            <i className="fas fa-check"> </i>Cambiar
                                                        </button>
                                                        :
                                                        <button className="btn btn-secondary w-100 mt-2" onClick={
                                                            () => {
                                                                changeServiceStatus(serv);
                                                            }
                                                        }>
                                                            <i className="fas fa-times"> </i> Cambiar
                                                        </button>
                                                }
                                            </div>
                                            <div className="col-4">
                                                <button className="btn btn-success w-100 mt-2" onClick={
                                                    () => {
                                                        modifyModal(serv.id);
                                                    }
                                                }>
                                                    <i className="fas fa-edit"> </i>Editar
                                                </button>
                                            </div>
                                            <div className="col-4">
                                                <button className="btn btn-danger w-100 mt-2"
                                                    onClick={
                                                        () => {
                                                            deleteService(serv.id);
                                                        }
                                                    }>
                                                    <i className="fas fa-trash-alt"> </i>Eliminar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="card mt-2">
                                <div className="card-body">
                                    <h5 className="card-title text-center">No hay servicios registrados para esa fecha ó persona.</h5>
                                </div>
                            </div>
                        )
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
                                    modify ? "Modificar Servicio" : "Agregar Servicio"
                                }
                            </h5>
                            <button
                                type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Formulario */}
                            <div className="row mb-3">
                                <div className="col-12">
                                    <label htmlFor="id_vehiculo" className="form-label">Vehículo</label>
                                    <select className="form-select" aria-label="Default select example" name="id_vehiculo" id="id_vehiculo" value={newService.id_vehiculo} onChange={handleSelectChange}>
                                        <option defaultValue>Selecciona una opción</option>
                                        {
                                            vehicles.length > 0 ? (
                                                vehicles.map((vehicle) => (
                                                    <option key={vehicle.id} value={vehicle.id}>{vehicle.modelo} - {vehicle.Usuario.nombre} {vehicle.Usuario.apePaterno} {vehicle.Usuario.apeMaterno}</option>
                                                ))
                                            ) : (
                                                <option value="0">No hay vehículos registrados</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-5 mb-3">
                                    <label htmlFor="fechaProgramada" className="form-label">Fecha Programada</label>
                                    <input type="date" className="form-control" id="fechaProgramada" name="fechaProgramada" value={newService.fechaProgramada} onChange={handleInputChange} />
                                </div>
                                <div className="col-4 mb-3">
                                    <label htmlFor="kilometrajeServicio" className="form-label ka">Kilom. de Servicio</label>
                                    <input type="number" className="form-control" id="kilometrajeServicio" name="kilometrajeServicio" value={newService.kilometrajeServicio} onChange={handleInputChange} />
                                </div>
                                <div className="col-3 mb-4">
                                    <label htmlFor="presupuesto" className="form-label">Presupuesto</label>
                                    <input type="number" className="form-control" id="presupuesto" name="presupuesto" value={newService.presupuesto} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label htmlFor="apeMaterno" className="form-label">Tipo de Servicio</label>
                                    <select className="form-select" aria-label="Default select example" name="tipoServicio" value={newService.tipoServicio} onChange={handleInputChange}>
                                        <option defaultValue>Selecciona una opción</option>
                                        <option value="Mantenimiento preventivo">Mantenimiento preventivo</option>
                                        <option value="Mantenimiento Mayor">Mantenimiento Mayor</option>
                                        <option value="De verificación">Servicio para verificación</option>
                                    </select>
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="ubicacionServicio" className="form-label">Ubicación</label>
                                    <input type="text" className="form-control" id="ubicacionServicio" name="ubicacionServicio" value={newService.ubicacionServicio} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label htmlFor="mecanico" className="form-label">Mecánico/Taller</label>
                                    <input type="text" className="form-control" id="mecanico" name="mecanico" value={newService.mecanico} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                                    <textarea className="form-control" id="descripcion" name="descripcion" value={newService.descripcion} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12">
                                    <div id="mapa"></div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* Botón para agregar usuario o modificar usuario*/}
                            {
                                modify ?
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            editService();
                                        }
                                    }>Modificar</button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            addService();
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
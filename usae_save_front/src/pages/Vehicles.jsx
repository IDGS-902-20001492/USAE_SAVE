import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./Vehicles.css";
import { API_URL } from "../Api_url";

const Vehicles = () => {
    const [car, setCar] = useState({
        id: 0,
        marca: "",
        modelo: "",
        tipo: "",
        placas: "",
        imagen: "",
        combustible: "",
        kilometrajeRegistro: 0,
        comparteCon: "",
        id_usuario: 0,
        estatus: "True",
    });

    const [carts, setAllCarts] = useState([]);

    const [users, setUsers] = useState([]);

    const [showModal, setShowModal] = useState(false);
    //Variable para determinar que botón se muestra en el modal
    const [modify, setModify] = useState(false);
    //Variable par saber si buscó o no
    const [search, setSearch] = useState(false);

    useEffect(() => {
        getCars();
        getUsers();
    }, []);

    const [auxImg, setAuxImg] = useState("");

    const getCars = async () => {
        try {
            const res = await fetch(API_URL + "/api/Vehiculos");
            const data = await res.json();

            if (localStorage.getItem("level") === "2") {
                setAllCarts(data);
            } else {
                let cars = data.filter((car) => car.id_usuario === parseInt(localStorage.getItem("id")));

                //Si el usuario no tiene vehiculos asignados, buscamos si tiene vehiculos compartidos
                if (cars.length === 0) {
                    //Hacemos una busqueda tipo like para encontrar los vehiculos compartidos
                    let carsShared = data.filter((car) => car.comparteCon === localStorage.getItem("fullname"));
                    setAllCarts(carsShared);
                } else {
                    setAllCarts(cars);
                }
            }


        } catch (error) {
            console.log(error);
        }
    }

    const getUsers = async () => {
        try {
            const res = await fetch(API_URL + "/api/Usuarios");
            const data = await res.json();
            if (localStorage.getItem("level") === "2") {
                setUsers(data);
            } else {
                let users = data.filter((user) => user.id === parseInt(localStorage.getItem("id")));
                setUsers(users);
            }
        }
        catch (error) {
            console.log(error);
        }
    };

    // Función para convertir una imagen a base64
    const convertirBase64 = (imagen) => {
        return new Promise((resolve, reject) => {
            let fileReader = new FileReader();
            fileReader.readAsDataURL(imagen);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    }

    const from64 = (imagen) => {
        return imagen;
    }

    const addCar = async () => {
        try {
            if (validateFields() === false) {
                let camposVacios = "";
                for (let campo in car) {
                    if (car[campo] === "") {
                        if (campo !== "imagen") {
                            if (campo !== "comparteCon") {
                                camposVacios += campo + ", ";
                            }
                        }
                    }
                }
                mostrarSweetAlert("Error", "Los siguientes campos están vacios: " + camposVacios, "error");
                return;
            } else {
                await fetch(API_URL + "/api/Vehiculos", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(car)
                }).catch((error) => {
                    console.log(error);
                }).then((response) => {
                    if (response.ok === true) {
                        mostrarSweetAlert("Registro exitoso", "El vehiculo se registró correctamente", "success");
                        getCars();
                        //Limpiar formulario
                        setCar({
                            id: 0,
                            marca: "",
                            modelo: "",
                            tipo: "",
                            placas: "",
                            imagen: "",
                            combustible: "",
                            kilometrajeRegistro: "",
                            comparteCon: "",
                            id_usuario: "",
                            estatus: "True",
                        });
                        closeModal();

                    } else {
                        //Impresión de error en consola
                        console.log(response);
                        mostrarSweetAlert("Error", "El vehiculo no se pudo registrar", "error");
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const editCar = async () => {
        try {
            if (validateFields() === false) {
                let camposVacios = "";
                for (let campo in car) {
                    if (car[campo] === "") {
                        if (campo !== "imagen") {
                            if (campo !== "comparteCon") {
                                camposVacios += campo + ", ";
                            }
                        }
                    }
                }
                mostrarSweetAlert("Error", "Los siguientes campos están vacios: " + camposVacios, "error");
                return;
            } else {
                await fetch(API_URL + `/api/Vehiculos/${car.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(car)
                }).catch((error) => {
                    console.log(error);
                }).then((response) => {
                    if (response.ok === true) {
                        mostrarSweetAlert("Modificación exitosa", "El usuario se modificó correctamente", "success");
                        getCars();
                        //Limpiar formulario
                        setCar({
                            id: 0,
                            marca: "",
                            modelo: "",
                            tipo: "",
                            placas: "",
                            imagen: "",
                            combustible: "",
                            kilometrajeRegistro: "",
                            comparteCon: "",
                            id_usuario: "",
                            estatus: "True",
                        });
                        closeModal();

                    } else {
                        //Impresión de error en consola
                        console.log(response);
                        mostrarSweetAlert("Error", "El usuario no se pudo modificar", "error");
                    }
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "El vehiculo se eliminará.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(API_URL + `/api/Vehiculos/${id}`, {
                        method: "DELETE",
                    }).catch((error) => {
                        console.log(error);
                    }).then((response) => {
                        if (response.ok === true) {
                            Swal.fire(
                                "¡Eliminado!",
                                "El Vehiculo ha sido eliminado.",
                                "success"
                            );
                            getCars();
                        } else {
                            //Impresión de error en consola
                            console.log(response);
                            mostrarSweetAlert("Error", "El Vehiculo no se pudo eliminar", "error");
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

    const findCar = async () => {
        const nombre = document.getElementById("buscar").value;

        try {
            const res = await fetch(API_URL + `/api/Vehiculos/Search?query=${nombre}`);
            const data = await res.json();
            setAllCarts(data);
            setSearch(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClear = () => {
        document.getElementById("buscar").value = "";
        getCars();
        setSearch(false);
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
        setCar({
            ...car,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {
        const { files } = e.target;
        convertirBase64(files[0])
            .then((imagen) => {
                setAuxImg(imagen);
                return imagen;
            })
            .then((imagen) => {
                setCar({
                    ...car,
                    imagen: imagen,
                });
                console.log(auxImg);
            });
    };


    const openModal = () => {
        setShowModal(true);
        setModify(false);
    };

    const modifyModal = async (id) => {
        setShowModal(true);
        setModify(true);
        //Ponemos los datos del usuario en el formulario
        try {
            const res = await fetch(API_URL + `/api/Vehiculos/${id}`);
            const data = await res.json();
            setCar(data);
        } catch (error) {
            console.log(error);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        //Limpiamos el formulario
        setCar({
            id: 0,
            marca: "",
            modelo: "",
            tipo: "",
            placas: "",
            imagen: "",
            combustible: "",
            kilometrajeRegistro: "",
            comparteCon: "",
            id_usuario: "",
            estatus: "True",
        });
    };

    //Función para abrir la imagen en una nueva pestaña
    const openImage = (img) => {
        //Creamos una nueva ventana
        const newWindow = window.open();

        //Crear un elemento de imagen a la nueva ventana
        newWindow.document.write(`<img src="${img}" alt="Imagen de vehiculo" />`);

    }

    const validateFields = () => {
        if (car.marca === "" || car.modelo === "" || car.tipo === "" || car.placas === "" || car.combustible === "" || car.kilometrajeRegistro === "" || car.id_usuario === "") {
            return false;
        } else {
            return true;
        }
    }

    const confirmarActualizacion = async () => {
        //Preguntamos si el usuario está seguro de actualizar el kilometraje
        Swal.fire({
            title: "¿Estás seguro?",
            text: "El kilometraje se actualizará.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Si",
            cancelButtonText: "No, cancelar",
        }).then((result) => {
            if (result.isConfirmed) {
                actKilometraje();
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                    "Cancelado",
                    "Actualización cancelada",
                    "Success"
                );
            }
        });
    }

    const actKilometraje = async () => {
        const kilometraje = document.getElementById("actKilometraje").value;
        const cocheAsignado = carts[0];

        if (kilometraje === "") {
            mostrarSweetAlert("Error", "El campo de kilometraje no puede estar vacío", "error");
            return;
        } else if (kilometraje < cocheAsignado.kilometrajeRegistro) {
            mostrarSweetAlert("Error", "El kilometraje no puede ser menor al registrado", "error");
            return;
        } else {
            try {
                //Haciendo un put con 2 parametros
                await fetch(API_URL + `/api/Vehiculos/UpdateKilometraje?id=${cocheAsignado.id}&kilometraje=${kilometraje}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(cocheAsignado)
                }
                ).catch((error) => {
                    console.log(error);
                }).then((response) => {
                    if (response.ok === true) {
                        mostrarSweetAlert("Modificación exitosa", "El kilometraje se actualizó correctamente", "success");
                        getCars();
                        //Limpiar formulario
                        setCar({
                            id: 0,
                            marca: "",
                            modelo: "",
                            tipo: "",
                            placas: "",
                            imagen: "",
                            combustible: "",
                            kilometrajeRegistro: "",
                            comparteCon: "",
                            id_usuario: "",
                            estatus: "True",
                        });
                        //Limpiamos el input de kilometraje
                        document.getElementById("actKilometraje").value = "";
                    } else {
                        //Impresión de error en consola
                        console.log(response);
                        mostrarSweetAlert("Error", "El kilometraje no se pudo modificar", "error");
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
        }
    }

    const actKilometrajeSweetAlert = (cartId, kiloAnterior, coche) => {
        Swal.fire({
            title: "Actualizar Kilometraje",
            html: "<input type='number' id='updateKilometraje' class='swal2-input' placeholder=" + kiloAnterior + ">",
            showCancelButton: true,
            confirmButtonText: "Actualizar",
            cancelButtonText: "Cancelar",
            showLoaderOnConfirm: true,
            preConfirm: (kilometraje) => {
                if (kilometraje === "") {
                    Swal.showValidationMessage("El campo de kilometraje no puede estar vacío");
                } else if (kiloAnterior > document.getElementById("updateKilometraje").value) {
                    Swal.showValidationMessage("El kilometraje no puede ser menor al registrado");
                }
                return fetch(API_URL + `/api/Vehiculos/UpdateKilometraje?id=${cartId}&kilometraje=${document.getElementById("updateKilometraje").value}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(coche)
                })
                    .then((response) => {
                        if (!response.status == 204) {
                            throw new Error(response.statusText);
                        }
                        return response;
                    })
                    .catch((error) => {
                        Swal.showValidationMessage(`Error al actualizar: ${error}`);
                    });
            },
            allowOutsideClick: () => !Swal.isLoading()
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire("¡Actualizado!", "El kilometraje ha sido actualizado.", "success");
                getCars();
            }
        });
    }

    return (
        <div className="fluid-content noS fade-in">
            <h1 className="text-center text-white"><i className="fas fa-car"></i> Vehiculos</h1>
            <div className="row">
                <div className="col-md-10">
                    {
                        localStorage.getItem("level") === "2" ? (

                            <div className="input-group mb-3">
                                <input type="text" className="form-control" id="buscar" placeholder="Buscar" aria-label="Recipient's username" aria-describedby="button-addon2" />

                                {
                                    search ?
                                        <div>
                                            <button className="btn btn-secondary" type="button" onClick={handleClear}>
                                                Limpiar
                                            </button>
                                            <button className="btn btn-secondary" type="button" id="button-addon2"
                                                onClick={
                                                    () => {
                                                        findCar();
                                                    }
                                                }>Buscar</button>
                                        </div>
                                        :
                                        <button className="btn btn-outline-secondary" type="button" id="button-addon2"
                                            onClick={
                                                () => {
                                                    findCar();
                                                }
                                            }>Buscar</button>
                                }
                            </div>
                        ) : (
                            <>
                                {/*Creamos una sección dedicada a actualizar el kilometraje del vehiculo*/}
                                <div className="input-group mb-3">
                                    <input type="number" className="form-control" id="actKilometraje" />
                                    <button className="btn btn-secondary" type="button" id="button-addon2" onClick={confirmarActualizacion}>Actualizar Kilometraje</button>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="col-md-2">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        {
                            localStorage.getItem("level") === "1" && carts.length != 0 ? (
                                <button className="btn btn-primary me-md-2 escritorio-add" type="button" onClick={openModal} disabled >
                                    <i className="fas fa-plus"></i>
                                    Agregar Vehiculo
                                </button>
                            ) : (
                                <button className="btn btn-primary me-md-2 escritorio-add" type="button" onClick={openModal} >
                                    <i className="fas fa-plus"></i>
                                    Agregar Vehiculo
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
            <div className="row">
                {
                    localStorage.getItem("level") === "1" && carts.length != 0 ? (
                        <div className="col-md-2">
                            <button className="btn btn-primary me-md-2 movil-add" type="button" onClick={openModal} disabled >
                                <i className="fas fa-plus"></i>Agregar
                            </button>
                        </div>
                    ) : (
                        <div className="col-md-2">
                            <button className="btn btn-primary me-md-2 movil-add" type="button" onClick={openModal} >
                                <i className="fas fa-plus"></i>Agregar
                            </button>
                        </div>
                    )
                }
            </div>

            <div className="row mt-3">
                <div id="escritorioUsers" className="col-md-12">
                    <table className="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th>Imagen</th>
                                <th>Marca</th>
                                <th>Modelo</th>
                                <th>Placas</th>
                                <th>Tipo</th>
                                <th>Combustible</th>
                                <th>Kilometraje</th>
                                <th>Principal</th>
                                <th>Compartido</th>
                                <th>Actualizar KM</th>
                                <th>Editar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {carts.length > 0 ? (
                                carts.map((vehicle) => (
                                    <tr key={vehicle.id}>
                                        {
                                            vehicle.imagen ? (
                                                <td className="tdImg"><button className="btnAbrirImg" onClick={() => { openImage(vehicle.imagen) }}><img className="imgCocheMini" src={from64(vehicle.imagen)} /></button></td>
                                            ) : (
                                                <td className="tdImg"><button className="btnAbrirImg" onClick={() => { openImage("/img/coche.png") }}><img className="imgCocheMini" src="/img/coche.png" /></button></td>
                                            )
                                        }
                                        <td>{vehicle.marca}</td>
                                        <td>{vehicle.modelo}</td>
                                        <td>{vehicle.placas}</td>
                                        <td>{vehicle.tipo}</td>
                                        <td>{vehicle.combustible}</td>
                                        <td>{vehicle.kilometrajeRegistro} KM</td>
                                        <td>{vehicle.Usuario.nombre} {vehicle.Usuario.apePaterno} {vehicle.Usuario.apeMaterno}</td>
                                        <td>{
                                            vehicle.comparteCon !== "" ? (
                                                <div>
                                                    {vehicle.comparteCon}<br />
                                                </div>
                                            ) : (
                                                <div>
                                                    No compartido<br />
                                                </div>
                                            )
                                        }</td>
                                        <td>
                                            <button className="btn btn-info" onClick={() => { actKilometrajeSweetAlert(vehicle.id, vehicle.kilometrajeRegistro, vehicle) }}>
                                                <i className="fas fa-arrow-up"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-success" onClick={
                                                () => {
                                                    modifyModal(vehicle.id);
                                                }
                                            }>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger"
                                                onClick={
                                                    () => {
                                                        deleteUser(vehicle.id);
                                                    }
                                                }>
                                                <i className="fas fa-trash-alt"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="11" className="text-center">No hay vehiculos activos por aquí.
                                        <br></br>
                                        <td><i className="fa-solid fa-car-burst" style={{ fontSize: '5.3em', marginLeft: '520%' }}></i></td>
                                    </td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
                {/*Creamos cards para la versión movil*/}
                <div id="movilUsers" className="col-md-12">
                    {carts.length > 0 ? (
                        carts.map((carCard) => (
                            <div className="card mb-3" key={carCard.id}>
                                <div className="row no-gutters">
                                    <div className="col-md-4">
                                        <figure className="text-center">
                                            {carCard.imagen ? (
                                                <img className="img-fluid imgCart" src={from64(carCard.imagen)} alt="Car" />
                                            ) : (
                                                <img className="img-fluid imgCart" src="/img/coche.png" alt="Default Car" />
                                            )}
                                        </figure>
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{carCard.marca} - {carCard.modelo}</h5>
                                            <div className="row">
                                                <div className="col-6">
                                                    <p className="card-text">
                                                        <strong>Placas: </strong>{carCard.placas}<br />
                                                        <strong>Tipo: </strong>{carCard.tipo}<br />
                                                        <strong>Combustible: </strong>{carCard.combustible}<br />
                                                        <strong>Kilometraje: </strong>{carCard.kilometrajeRegistro} KM
                                                    </p>
                                                </div>
                                                <div className="col-6">
                                                    <p className="card-text">
                                                        <strong>Principal: </strong>{carCard.Usuario.nombre} {carCard.Usuario.apePaterno} {carCard.Usuario.apeMaterno}<br />
                                                        <strong>Compartido: </strong>
                                                        {carCard.comparteCon !== "" ? (
                                                            <div>
                                                                {carCard.comparteCon}<br />
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                No compartido<br />
                                                            </div>
                                                        )}

                                                    </p>
                                                </div>
                                            </div>
                                            <div className="row mt-3">
                                                <div className="col-4">
                                                    <button className="btn btn-info w-100" onClick={() => actKilometrajeSweetAlert(carCard.id, carCard.kilometrajeRegistro, carCard)}>
                                                        <i className="fas fa-arrow-up"></i> Act. KM
                                                    </button>
                                                </div>
                                                <div className="col-4">
                                                    <button className="btn btn-success w-100" onClick={() => modifyModal(carCard.id)}>
                                                        <i className="fas fa-edit"></i> Editar
                                                    </button>
                                                </div>
                                                <div className="col-4">
                                                    <button className="btn btn-danger w-100" onClick={() => deleteUser(carCard.id)}>
                                                        <i className="fas fa-trash-alt"></i> Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))) : (
                        <div className="alert alert-warning" role="alert">
                            No hay vehiculos activos por aquí.
                            <i className="fa-solid fa-car-burst" style={{ fontSize: '5.3em', marginLeft: '520%' }}></i>
                        </div>
                    )}
                </div>
            </div>
            {/*Creamos un div modal*/}
            <div
                className={`modal fade ${showModal ? "show" : ""}`}
                id="modalAddUser" tabIndex="-2" role="dialog"
                style={{ display: showModal ? "block" : "none" }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {
                                    modify ? "Modificar Vehiculo" : "Agregar Vehiculo"
                                }
                            </h5>
                            <button
                                type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Formulario */}
                            <div className="row">
                                <div className="col-4 mb-3">
                                    <label htmlFor="marca" className="form-label">Marca</label>
                                    <input type="text" className="form-control" id="marca" name="marca" value={car.marca} onChange={handleInputChange} />
                                </div>
                                <div className="col-4 mb-3">
                                    <label htmlFor="modelo" className="form-label">Modelo</label>
                                    <input type="text" className="form-control" id="modelo" name="modelo" value={car.modelo} onChange={handleInputChange} />
                                </div>
                                <div className="col-4 mb-3">
                                    <label htmlFor="Placas" className="form-label">Placas</label>
                                    <input type="text" className="form-control" id="placas" name="placas" value={car.placas} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label htmlFor="tipo" className="form-label">Tipo</label>
                                    <input type="text" className="form-control" id="tipo" name="tipo" value={car.tipo} onChange={handleInputChange} />
                                </div>
                                <div className="col-6 mb-3">
                                    <label htmlFor="combustible" className="form-label">Tipo de Combustible</label>
                                    <input type="text" className="form-control" id="combustible" name="combustible" value={car.combustible} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3 mb-3">
                                    <label htmlFor="kilometrajeRegistro" className="form-label">Kilometraje</label>
                                    <input type="number" className="form-control" id="kilometrajeRegistro" name="kilometrajeRegistro" value={car.kilometrajeRegistro} onChange={handleInputChange} />
                                </div>
                                <div className="col-9 mb-3">
                                    <label htmlFor="id_usuario" className="form-label">Usuario principal:</label>
                                    {/*Select para seleccionar usuarios*/}
                                    <select className="form-select" id="id_usuario" name="id_usuario" value={car.id_usuario} onChange={handleInputChange}>
                                        <option value="0">Selecciona un usuario</option>
                                        {
                                            users.map((user) => (
                                                <option key={user.id} value={user.id}>{user.nombre} {user.apePaterno} {user.apeMaterno}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="row mg--1">
                                <div className="col-8">
                                    <label htmlFor="comparteCon" className="form-label">Se comparte con:</label>
                                    {/*Input de tipo texto para el nombre del usuario compartido*/}
                                    <input type="text" className="form-control" id="comparteCon" name="comparteCon" value={car.comparteCon} onChange={handleInputChange} />
                                </div>

                                <div className="col-4">
                                    <label htmlFor="imagen" className="form-label">Imagen</label>
                                    <input type="file" className="form-control" id="imagen" name="imagen" onChange={handleImageChange} />
                                </div>
                                <div className="col-mb-12">
                                    <div className="imgMargCart mt-3">
                                        {
                                            car.imagen ?
                                                <img className="imgCart" src={from64(car.imagen)} />
                                                :
                                                <img className="imgCart" src="/img/coche.png" />
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* Botón para agregar vehiculo o modificar vehiculo*/}
                            {
                                modify ?
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            editCar();
                                        }
                                    }>Modificar</button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            addCar();
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

export default Vehicles
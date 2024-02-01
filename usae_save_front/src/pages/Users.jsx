import { useEffect, useState } from "react"
import "./Users.css"
import Swal from "sweetalert2";

export const Users = () => {

    const [users, setUsers] = useState([]);

    const [newUser, setNewUser] = useState({
        id: 0,
        nombre: "",
        apePaterno: "",
        apeMaterno: "",
        telefono: "",
        centroTrabajo: "",
        zona: "",
        nivel: "",
        gobierno: "",
        email: "",
        contrasena: "",
        permiso: 1,
        estatus: 1
    });

    const [showModal, setShowModal] = useState(false);
    //Variable para determinar que botón se muestra en el modal
    const [modify, setModify] = useState(false);
    //Variable par saber si buscó o no
    const [search, setSearch] = useState(false);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await fetch("/api/Usuarios");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    const addUser = async () => {
        try {

            await fetch("/api/Usuarios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.ok === true) {
                    mostrarSweetAlert("Registro exitoso", "El usuario se registró correctamente", "success");
                    getUsers();
                    //Limpiar formulario
                    setNewUser({
                        id: 0,
                        nombre: "",
                        apePaterno: "",
                        apeMaterno: "",
                        telefono: "",
                        centroTrabajo: "",
                        zona: "",
                        nivel: "",
                        gobierno: "",
                        email: "",
                        contrasena: "",
                        permiso: 1,
                        estatus: 1
                    });
                    closeModal();

                } else {
                    //Impresión de error en consola
                    console.log(response);
                    mostrarSweetAlert("Error", "El usuario no se pudo registrar", "error");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const editUser = async () => {
        try {
            await fetch(`/api/Usuarios/${newUser.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.ok === true) {
                    mostrarSweetAlert("Modificación exitosa", "El usuario se modificó correctamente", "success");
                    getUsers();
                    //Limpiar formulario
                    setNewUser({
                        id: 0,
                        nombre: "",
                        apePaterno: "",
                        apeMaterno: "",
                        telefono: "",
                        centroTrabajo: "",
                        zona: "",
                        nivel: "",
                        gobierno: "",
                        email: "",
                        contrasena: "",
                        permiso: 1,
                        estatus: 1
                    });
                    closeModal();

                } else {
                    //Impresión de error en consola
                    console.log(response);
                    mostrarSweetAlert("Error", "El usuario no se pudo modificar", "error");
                }
            });
        }
        catch (error) {
            console.log(error);
        }
    }

    const deleteUser = async (id) => {
        try {
            Swal.fire({
                title: "¿Estás seguro?",
                text: "El usuario se eliminará.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Si",
                cancelButtonText: "No, cancelar",
            }).then((result) => {
                if (result.isConfirmed) {
                    fetch(`/api/Usuarios/${id}`, {
                        method: "DELETE",
                    }).catch((error) => {
                        console.log(error);
                    }).then((response) => {
                        if (response.ok === true) {
                            Swal.fire(
                                "¡Eliminado!",
                                "El usuario ha sido eliminado.",
                                "success"
                            );
                            getUsers();
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

    const findUser = async () => {
        const nombre = document.getElementById("buscar").value;

        try {
            const res = await fetch(`/api/Usuarios/Search?query=${nombre}`);
            const data = await res.json();
            setUsers(data);
            setSearch(true);
        } catch (error) {
            console.log(error);
        }
    }

    const handleClear = () => {
        document.getElementById("buscar").value = "";
        getUsers();
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
        setNewUser({
            ...newUser,
            [name]: value,
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
            const res = await fetch(`/api/Usuarios/${id}`);
            const data = await res.json();
            setNewUser(data);
        } catch (error) {
            console.log(error);
        }
    }

    const closeModal = () => {
        setShowModal(false);
        //Limpiamos el formulario
        setNewUser({
            id: 0,
            nombre: "",
            apePaterno: "",
            apeMaterno: "",
            telefono: "",
            centroTrabajo: "",
            zona: "",
            nivel: "",
            gobierno: "",
            email: "",
            contrasena: "",
            permiso: 1,
            estatus: 1
        });
    };

    return (
        <div className="fluid-content noS">
            <h1 className="text-center text-white"><i className="fas fa-users"></i> Usuarios</h1>
            <div className="row">
                <div className="col-md-10">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" id="buscar" placeholder="Buscar" aria-label="Recipient's username" aria-describedby="button-addon2" />

                        {
                            search ?
                                <div>
                                    <button className="btn btn-outline-secondary" type="button" onClick={handleClear}>
                                        Limpiar
                                    </button>
                                    <button className="btn btn-outline-secondary" type="button" id="button-addon2"
                                        onClick={
                                            () => {
                                                findUser();
                                            }
                                        }>Buscar</button>
                                </div>
                                :
                                <button className="btn btn-outline-secondary" type="button" id="button-addon2"
                                    onClick={
                                        () => {
                                            findUser();
                                        }
                                    }>Buscar</button>
                        }
                    </div>
                </div>
                <div className="col-md-2">
                    <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                        <button className="btn btn-primary me-md-2 escritorio-add" type="button" onClick={openModal} >
                            <i className="fas fa-plus"></i>
                            Agregar usuario
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
                                <th>Nombre</th>
                                <th>Apellido Paterno</th>
                                <th>Apellido Materno</th>
                                <th>Teléfono</th>
                                <th>Centro de Trabajo</th>
                                <th>Zona/Sector</th>
                                <th>Nivel</th>
                                <th>Gobierno</th>
                                <th>Email</th>
                                <th>Editar</th>
                                <th>Borrar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.nombre}</td>
                                        <td>{user.apePaterno}</td>
                                        <td>{user.apeMaterno}</td>
                                        <td>{user.telefono}</td>
                                        <td>{user.centroTrabajo}</td>
                                        <td>{user.zona}</td>
                                        <td>{user.nivel}</td>
                                        <td>{user.gobierno}</td>
                                        <td>{user.email}</td>
                                        <td>
                                            <button className="btn btn-success" onClick={
                                                () => {
                                                    modifyModal(user.id);
                                                }
                                            }>
                                                <i className="fas fa-edit"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button className="btn btn-danger"
                                                onClick={
                                                    () => {
                                                        deleteUser(user.id);
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
                        users.map((user) => (
                            <div className="card mt-2" key={user.id}>
                                <div className="card-body shadow rounded">
                                    <div className="row">
                                        <div className="bgImg col-6">
                                            <div className="margImg">
                                                <img className="imgDefault" src="/img/usuario.png" />
                                            </div>

                                        </div>
                                        <div className="col-6">
                                            <h5 className="card-title fw-bold">{user.nombre} {user.apePaterno} {user.apeMaterno}</h5>
                                            <p className="card-text"><b>Telefono:</b> {user.telefono}</p>
                                            <p className="card-text"><b>Centro de Trabajo:</b> {user.centroTrabajo}</p>
                                            <p className="card-text"><b>Zona/Sector:</b> {user.zona}</p>
                                            <p className="card-text"><b>Nivel:</b> {user.nivel}</p>
                                            <p className="card-text"><b>Gobierno: </b>{user.gobierno}</p>
                                            <p className="card-text"><b>Email:</b> {user.email}</p>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-6">
                                            <button className="btn btn-success w-100 mt-2" onClick={
                                                () => {
                                                    modifyModal(user.id);
                                                }
                                            }>
                                                <i className="fas fa-edit"> </i>Editar
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button className="btn btn-danger w-100 mt-2"
                                                onClick={
                                                    () => {
                                                        deleteUser(user.id);
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
                                    modify ? "Modificar usuario" : "Agregar usuario"
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
                                    <label htmlFor="nombre" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="nombre" name="nombre" value={newUser.nombre} onChange={handleInputChange} />
                                </div>
                                <div className="col-4 mb-3">
                                    <label htmlFor="apePaterno" className="form-label">Apellido Paterno</label>
                                    <input type="text" className="form-control" id="apePaterno" name="apePaterno" value={newUser.apePaterno} onChange={handleInputChange} />
                                </div>
                                <div className="col-4 mb-3">
                                    <label htmlFor="apeMaterno" className="form-label">Apellido Materno</label>
                                    <input type="text" className="form-control" id="apeMaterno" name="apeMaterno" value={newUser.apeMaterno} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-4 mb-3">
                                    <label htmlFor="telefono" className="form-label">Telefono</label>
                                    <input type="number" className="form-control" id="telefono" name="telefono" value={newUser.telefono} onChange={handleInputChange} />
                                </div>
                                <div className="col-8 mb-3">
                                    <label htmlFor="centroTrabajo" className="form-label">Centro de Trabajo</label>
                                    <input type="text" className="form-control" id="centroTrabajo" name="centroTrabajo" value={newUser.centroTrabajo} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12 mb-3">
                                    <label htmlFor="zona" className="form-label">Zona/Sector</label>
                                    <input type="text" className="form-control" id="zona" name="zona" value={newUser.zona} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="nivel" className="form-label">Nivel</label>
                                    <input type="text" className="form-control" id="nivel" name="nivel" value={newUser.nivel} onChange={handleInputChange} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="gobierno" className="form-label">Tipo Gobierno</label>
                                    <select className="form-select" onChange={handleInputChange} name="gobierno" value={newUser.gobierno || ""}>
                                        <option defaultValue>Seleccionar</option>
                                        <option value="Federal">Federal</option>
                                        <option value="Estatal">Estatal</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input type="email" className="form-control" id="email" name="email" value={newUser.email} onChange={handleInputChange} />
                                </div>
                                <div className="col-6">
                                    <label htmlFor="contrasena" className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" id="contrasena" name="contrasena" value={newUser.contrasena} onChange={handleInputChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {/* Botón para agregar usuario o modificar usuario*/}
                            {
                                modify ?
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            editUser();
                                        }
                                    }>Modificar</button>
                                    :
                                    <button type="button" className="btn btn-primary" onClick={
                                        () => {
                                            addUser();
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
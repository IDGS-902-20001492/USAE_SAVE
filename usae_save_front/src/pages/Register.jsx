import { useState } from "react";
import "./Register.css"
import Swal from "sweetalert2";

export const Register = () => {

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

    const addUser = async () => {
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await fetch("/api/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newUser)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.status === 200) {
                    mostrarSweetAlert("Registro exitoso", "El usuario se registró correctamente", "success");
                    //Nos esperamos 1 segundo para redireccionar
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 1000);
                } else {
                    mostrarSweetAlert("Error", "El usuario no se pudo registrar", "error");
                }
            });

        } catch (error) {
            console.log(error);
        }
    };

    const mostrarSweetAlert = (title, text, icon) => {
        Swal.fire({
            title,
            text,
            icon,
            confirmButtonText: "Ok",
        });
    };

    const handleInputChange = (e) => {
        setNewUser({
            ...newUser,
            [e.target.name]: e.target.value
        });
    };


    return (
        <div>
            <div className="container-fluid fade-in">
                <div className="row grad justify-content-center align-items-center min-vh-100">
                    <div className="col-md-6 mt-3 ">
                        <div className="card">
                            <div className="card-body">
                                <h1 className="text-center">Registro</h1>
                                <br></br>
                                {/*Inicia formulario*/}
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="name" className="form-label">Nombre(s)</label>
                                            <input type="text" onChange={handleInputChange} name="nombre"
                                                className="form-control" id="name" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="lastname" className="form-label">Apellido paterno</label>
                                            <input type="text" onChange={handleInputChange} className="form-control"
                                                name="apePaterno" id="lastname" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="lastname2" className="form-label">Apellido materno</label>
                                            <input type="text" onChange={handleInputChange} className="form-control"
                                                name="apeMaterno" id="lastname2" placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-4">
                                        <div className="mb-3">
                                            <label htmlFor="telefono" className="form-label">Telefono</label>
                                            <input type="text" name="telefono"
                                                onChange={handleInputChange} className="form-control" id="telefono" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="mb-3">
                                            <label htmlFor="centro" className="form-label">Centro de trabajo</label>
                                            <input type="text" onChange={handleInputChange} name="centroTrabajo"
                                                className="form-control" id="centro" placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="mb-3">
                                            <label htmlFor="zona" className="form-label">Zona/Sector</label>
                                            <input type="email" onChange={handleInputChange} name="zona"
                                                className="form-control" id="email" placeholder="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="nivel" className="form-label">Nivel</label>
                                            <input type="text" onChange={handleInputChange} name="nivel"
                                                className="form-control" id="nivel" placeholder="" />
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="mb-3">
                                            <label htmlFor="gobierno" className="form-label">Tipo Gobierno</label>
                                            <select className="form-select" onChange={handleInputChange} name="gobierno">
                                                <option selected>Selecciona una opción</option>
                                                <option value="Federal">Federal</option>
                                                <option value="Estatal">Estatal</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Correo electrónico</label>
                                        <input type="email" onChange={handleInputChange} name="email"
                                            className="form-control" id="email" placeholder="" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Contraseña</label>
                                        <input type="password" onChange={handleInputChange} name="contrasena"
                                            className="form-control" id="password" placeholder="" />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password2" className="form-label">Confirmar contraseña</label>
                                        <input type="password" className="form-control" id="password2" placeholder="" />
                                    </div>
                                    <div className="d-grid">
                                        <button className="btn btn-primary btn-lg" onClick={addUser}>Registrarse</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
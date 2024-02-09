import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export const Login = () => {

    const [user, setUser] = useState({
        email: "",
        contrasena: ""
    });

    const handleInputChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    const getLogin = async () => {
        try {
            await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            }).catch((error) => {
                console.log(error);
            }).then((response) => {
                if (response.status === 200) {
                    response.json().then((data) => {
                        localStorage.setItem("auth", true);
                        localStorage.setItem("id", data.id);
                        localStorage.setItem("level", data.permiso);
                        localStorage.setItem("fullname", data.nombre + " " + data.apePaterno + " " + data.apeMaterno);
                        //Damos un time out para que se alcance a mostrar el mensaje de bienvenida                        
                        mostrarSweetAlert("Bienvenido(a)", data.nombre + " " + data.apePaterno + " " + data.apeMaterno, "success");
                        setTimeout(() => {
                            if (data.permiso === "2") {
                                window.location.href = "/users";
                            } else {
                                window.location.href = "/services";
                            }
                        }, 1600);
                    });
                } else {
                    //Si el error es 401, entonces el usuario no está registrado
                    if (response.status === 401 || response.status === 400 || response.status === 404) {
                        mostrarSweetAlert("Error", "El usuario no está registrado", "error");
                    } else {
                        mostrarSweetAlert("Advertencia", "Servidor desconectado", "warning");
                    }
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
    };

    return (
        <div className="container-fluid fade-in">
            <div className="row grad justify-content-center align-items-center min-vh-100">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h1 className="text-center">Iniciar Sesión</h1>
                            <br />
                            {/*Comienza el formulario*/}
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Correo electrónico</label>
                                <input type="email" className="form-control" id="email"
                                    onChange={handleInputChange} name="email" placeholder="Correo electrónico" />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Contraseña</label>
                                <input type="password" className="form-control" id="password"
                                    onChange={handleInputChange} name="contrasena" placeholder="Contraseña" />
                            </div>
                            <div className="d-grid">
                                <button onClick={getLogin} className="btn btn-primary btn-lg">Iniciar Sesión</button>
                            </div>


                            <div className="mt-1">
                                <Link to="/register">¿No tienes cuenta? Regístrate</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

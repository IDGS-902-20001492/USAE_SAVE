import { useState } from "react";
import "./Login.css";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { API_URL } from "../Api_url";

export const Login = () => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [user, setUser] = useState({
        email: "",
        contrasena: ""
    });

    const handleInputChange = (e) => {

        e.preventDefault();

        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    }

    //Función para prevenir ataques de inyección de código
    const cleanInput = (data) => {
        const cleanData = data.replace(/<(.*)>/, "");
        return cleanData;
    }

    //Función para codificar las contraseñas
    const encodePassword = (password) => {
        const pass = password;
        const encodedPass = btoa(pass);
        return encodedPass;
    }

    const getLogin = async (data) => {
        try {
            data.email = cleanInput(data.email);
            data.contrasena = cleanInput(data.contrasena);

            data.contrasena = encodePassword(data.contrasena);
            await fetch(API_URL + "/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
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
                            //Primero recargamos la página
                            window.location.reload();
                            //Luego redireccionamos dependiendo del level
                            if (localStorage.getItem("level") === "1") {
                                window.location.href = "/vehicles";
                            } else {
                                window.location.href = "/users";
                            }
                        }, 1600);
                    });
                } else {
                    //Si el error es 401, entonces el usuario no está registrado
                    if (response.status === 404) {
                        mostrarSweetAlert("Error", "El usuario no está registrado", "error");
                    } else if (response.status === 401 || response.status === 403 || response.status === 400) {
                        mostrarSweetAlert("Error", "Usuario o contraseña incorrectos", "error");
                    }
                    else {
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
                            <form onSubmit={handleSubmit(getLogin)}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input type="email" className="form-control" id="email"
                                        onChange={handleInputChange} placeholder="Correo electrónico"
                                        {...register("email", { required: true })}
                                    />
                                    {errors.email && <span className="text-danger">El email es requerido</span>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input type="password" className="form-control" id="password"
                                        onChange={handleInputChange} name="contrasena" placeholder="Contraseña"
                                        {...register("contrasena", { required: true })}
                                    />
                                    {errors.contrasena && <span className="text-danger">La contraseña es requerida</span>}
                                </div>
                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary btn-lg">Iniciar Sesión</button>
                                </div>
                            </form>


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

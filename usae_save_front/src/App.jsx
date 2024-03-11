import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { Users } from "./pages/Users";
import './Navbar.css';
import Vehicles from "./pages/Vehicles";
import { Services } from "./pages/Services";
import { Repairs } from "./pages/Repairs";
import { Home } from "./pages/Home";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Histories from "./pages/Histories";
import ShowHistory from "./components/ShowHistory";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Banner from "./pages/Banner";
import { Contact } from "./pages/Contact";
function App() {

  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setAuth(true);
    }
  }, []);

  const cerrarSesion = () => {
    //Generamos un sweetalert para preguntar si queremos cerrar sesión y cerrar la sesión con un progress bar
    Swal.fire({
      title: "¿Cerrar Sesión?",
      text: "Estás a punto de cerrar sesión",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: "Cerrando Sesión",
          html: "Saliendo del sistema... <i class='fa-solid fa-person-walking-arrow-right'></i>",
          timer: 1500,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
        });
        setTimeout(() => {
          localStorage.clear();
          setAuth(false);
          window.location.href = "/login";
        }, 1500);
      }
    });

  }

  return (
    <>
      <BrowserRouter>
        <div>
          {
            auth ? (
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">

                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                      {/*Creando un apartado para mostrar el nombre del usuario*/}
                      <li className="nav-item">
                        <label className="nav-link bg-info rounded shadow-lg mt-1">
                          <i className="fa-solid fa-user"></i>
                          <b>{localStorage.getItem("fullname")}</b>
                        </label>
                      </li>
                      <li className="nav-item">
                        <Link to="/" className="nav-link"><b>Inicio</b></Link>
                      </li>
                      {
                        localStorage.getItem("level") === "1" ? (
                          <>
                            <li className="nav-item">
                              <Link to="/vehicles" className="nav-link">Vehículos</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/services" className="nav-link">Servicios</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/repairs" className="nav-link">Reparaciones</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/histories" className="nav-link">Historial</Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link" onClick={() => {
                                cerrarSesion();
                              }}>Cerrar Sesión</Link>
                            </li>
                          </>
                        ) : (
                          <>
                            <li className="nav-item">
                              <Link to="/users" className="nav-link">Usuarios</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/vehicles" className="nav-link">Vehículos</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/services" className="nav-link">Servicios</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/repairs" className="nav-link">Reparaciones</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/histories" className="nav-link">Historiales</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            </li>
                            <li className="nav-item">
                              <Link to="/banner" className="nav-link">Banner</Link>
                            </li>
                            <li className="nav-item">
                              <Link className="nav-link" onClick={() => {
                                cerrarSesion();
                              }}>Cerrar Sesión</Link>
                            </li>
                          </>
                        )
                      }
                    </ul>
                  </div>
                </div>
              </nav>
            ) : (
              <nav className="navbar navbar-expand-lg navbar-light bg-light">
                <div className="container-fluid">
                  <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                  </button>
                  <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                      <li className="nav-item">
                        <Link to="/" className="nav-link"><b>Inicio</b></Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/login" className="nav-link">Iniciar Sesión</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/register" className="nav-link">Registrarse</Link>
                      </li>
                      <li className="nav-item">
                        <Link to="/contact" className="nav-link">Contacto</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </nav>
            )
          }
        </div>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/users" element={auth && localStorage.getItem("level") === "2" ? <Users /> : <Home />} />
          <Route path="/vehicles" element={auth ? <Vehicles /> : <Home />} />
          <Route path="/services" element={auth ? <Services /> : <Home />} />
          <Route path="/repairs" element={auth ? <Repairs /> : <Home />} />
          <Route path="/histories" element={auth ? <Histories /> : <Home />} />
          <Route path="/histories/:id" element={auth ? <ShowHistory /> : <Home />} />
          <Route path="/dashboard" element={auth && localStorage.getItem("level") === "2" ? <Dashboard /> : <Home />} />
          <Route path="/banner" element={auth && localStorage.getItem("level") == "2" ? <Banner /> : <Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

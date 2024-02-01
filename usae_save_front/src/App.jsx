import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import { Users } from "./pages/Users";
import './Navbar.css';
import Vehicles from "./pages/Vehicles";
import { Services } from "./pages/Services";
function App() {

  return (
    <>
      <BrowserRouter>
        <div>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <a className="navbar-brand" href="/">USAE Silao</a>
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon"></span></button>
              <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                <div className="navbar-nav">
                  <Link to="/users" className="nav-link">Usuarios</Link>
                  <Link to="/vehicles" className="nav-link">Vehiculos</Link>
                  <Link to="/services" className="nav-link">Servicios</Link>
                </div>
              </div>
            </div>
          </nav>
        </div>

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/services" element={<Services />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

import { useEffect, useState } from "react";
import "./Histories.css";
import { Link } from "react-router-dom";

const Histories = () => {

    const [cars, setCars] = useState([]);

    const getCars = async () => {
        const res = await fetch("api/Vehiculos");
        const data = await res.json();
        setCars(data);
    }

    useEffect(() => {
        getCars();
    }, []);


    return (
        <div className="fluid-content fade-in">
            <div className="row text-center mt-3 mb-2">
                <h1 className="text-white"><i className="fas fa-history"></i>
                    Historiales</h1>
            </div>
            <div className="container">
                <div className="row">
                    {cars.map((car) => (
                        <div key={car.id}>
                            <div className="card mb-3">
                                <div className="row">
                                    <div className="col-4">
                                        <div className="container_img">
                                            <img src={car.imagen} alt="imagen" className="imgAutomovil" />
                                        </div>
                                    </div>
                                    <div className="col-8">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-6">
                                                    <h5 className="card-title">{car.marca} {car.modelo}</h5>
                                                    <p className="card-text"><b>Kilometeraje:</b> {car.kilometrajeRegistro} <b>Km</b></p>
                                                    <p className="card-text"><b>Placas:</b> {car.placas}</p>
                                                    <Link to={`/histories/${car.id}`} className="btn btn-primary">Ver historial</Link>
                                                </div>
                                                <div className="col-6">
                                                    <p className="card-text"><b>Titular del vehiculo:</b> {car.Usuario.nombre} {car.Usuario.apePaterno} {car.Usuario.apeMaterno}</p>
                                                    <p className="card-text"><b>Comparte con:</b> {
                                                        car.comparteCon === null || car.comparteCon === "" ? "No compartido" : car.comparteCon
                                                    }</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Histories
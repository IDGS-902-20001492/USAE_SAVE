import { useEffect, useState } from "react";
import "./Histories.css";
import { Link } from "react-router-dom";

const Histories = () => {

    const [cars, setCars] = useState([]);
    const [searched, setSearched] = useState(false);

    const getCars = async () => {
        const res = await fetch("api/Vehiculos");
        const data = await res.json();

        if (localStorage.getItem("level") === "2") {
            setCars(data);
        } else {
            //Filtramos los vehiculos que pertenecen al usuario mediante el id
            let idUser = localStorage.getItem("id");
            let carsUser = data.filter(car => car.Usuario.id === parseInt(idUser));
            setCars(carsUser);
        }


    }

    const findCar = async () => {
        const nombre = document.getElementById("buscar").value;

        try {
            if (nombre === "") {
                return;
            } else {
                const res = await fetch(`/api/Vehiculos/Search?query=${nombre}`);
                const data = await res.json();
                setCars(data);
                setSearched(true);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const clearSearch = async () => {
        setSearched(false);
        getCars();
        document.getElementById("buscar").value = "";
    }

    useEffect(() => {
        getCars();
    }, []);


    return (
        <div className="fluid-content fade-in">
            <div className="row text-center mt-3 mb-2">
                <h1 className="text-white"><i className="fas fa-history"></i>
                    {
                        localStorage.getItem("level") === "1" ? (
                            <>
                                Historial
                            </>
                        ) : (
                            <>
                                Historiales
                            </>
                        )
                    }</h1>
            </div>
            {
                localStorage.getItem("level") === "2" ? (
                    <div className="row justify-content-center mb-2">
                        <div className="col-md-10">
                            {/*Input para buscar y boton*/}
                            <div className="input-group mb-3">
                                <input type="text" className="form-control" placeholder="Buscar" aria-label="Recipient's username" id="buscar" aria-describedby="button-addon2" />
                                {
                                    searched === false ? (
                                        <>
                                            <button className="btn btn-success" type="button" id="button-addon2" onClick={findCar}>Buscar</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="btn btn-secondary" type="button" id="button-addon2" onClick={clearSearch}>Limpiar</button>
                                        </>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                ) : (
                    <></>
                )
            }
            <div className="container">
                <div className="row">
                    {cars.map((car) => (
                        <div key={car.id}>
                            <div className="card mb-3">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="container_img">
                                            <img src={car.imagen} alt="imagen" className="imgAutomovil" />
                                        </div>
                                    </div>
                                    <div className="col-md-8">
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
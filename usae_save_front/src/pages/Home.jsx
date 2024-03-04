import { Carousel } from "react-bootstrap";
import "./Home.css";
import { useEffect, useState } from "react";

export const Home = () => {

    const [imagenes, setImagenes] = useState([])

    const getImagenes = async () => {
        const res = await fetch('api/ImagenBanners')
        const data = await res.json()
        setImagenes(data)
    };

    useEffect(() => {
        getImagenes()
    }, []);

    return (
        <div className="noS container-fluid fade-in">
            <div className="row text-center">
                <div className="col-12">
                    <h1 className="titulo_1 bg-info p-3 text-center text-white shadow-lg">Sistema de Administración Vehicular Emergente</h1>
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <Carousel>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={
                                    imagenes.length > 0 ? imagenes[0].imagen : "/img/BannerGTOjpg.jpg"
                                }
                                alt="First slide"
                            />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={
                                    imagenes.length > 1 ? imagenes[1].imagen : "/img/BannerGTOjpg.jpg"
                                }
                                alt="Second slide"
                            />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                        {/* Agrega más Carousel.Items según sea necesario */}

                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src={
                                    imagenes.length > 2 ? imagenes[2].imagen : "/img/BannerGTOjpg.jpg"
                                }
                                alt="Third slide"
                            />
                            <Carousel.Caption>
                            </Carousel.Caption>
                        </Carousel.Item>
                    </Carousel>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12">
                    <h1 className="h3 bg-info p-3 text-center text-white shadow-lg">Unidad de Servicios de Apoyo a la Educación Silao</h1>
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-12 col-md-4 mt-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <i className="fas fa-question-circle"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">¿Qué es SAVE?</h5>
                            <p className="card-text tj-p">
                                SAVE es el Sistema de Administración Vehicular Emergente, una plataforma que permite a los usuarios de la Unidad de Servicios de Apoyo a la Educación Silao, llevar un control de los vehículos que se encuentran dentro de la flotilla de la institución..
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mt-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <i className="fa-solid fa-car-on"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">¿Qué necesidad cubre?</h5>
                            <p className="card-text tj-p">
                                Cubre la necesidad de llevar un control y gestión de los vehiculos, reparaciones y mantenimientos que se realizan a los mismos, así como el control de los conductores que los utilizan.
                            </p>
                        </div>
                    </div>
                </div>
                <div className="col-12 col-md-4 mt-3">
                    <div className="card">
                        <div className="card-header text-center">
                            <i className="fa-solid fa-cogs"></i>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">¿Cómo funciona?</h5>
                            <p className="card-text tj-p">
                                El sistema funciona a través de una interfaz web, en la cual los usuarios pueden ingresar, registrar y consultar información de los vehículos, conductores y mantenimientos.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

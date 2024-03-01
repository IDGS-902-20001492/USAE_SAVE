import { useEffect, useState } from "react";
import DashboardGraphics from "../components/DashboardGraphics"
import "./Dashboard.css";

const Dashboard = () => {

    const [mileageHistory, setMileageHistory] = useState([]);
    const [mileageHistoryById, setMileageHistoryById] = useState([]);
    const [vehicle, setVehicle] = useState({});

    const getMileageHistory = async () => {
        const res = await fetch("api/Dashboard/HistorialesKilometraje");
        const data = await res.json();
        //Filtramos el historial donde el vehiculo tenga el estatus en true
        const dataFiltred = data.filter((item) => item.Vehiculo.estatus === true);
        setMileageHistory(dataFiltred);
    }

    const getMileageHistoryById = async (id) => {
        const res = await fetch("api/Dashboard/HistorialesKilometraje/" + id);
        const data = await res.json();
        setMileageHistoryById(data);
    }

    const validateService = async (id) => {
        const res = await fetch("api/Servicios");
        const data = await res.json();
        const dataFiltred = data.filter((item) => item.id_vehiculo === id);
        if (dataFiltred.length > 0) {
            //Volvemos a filtrar para obtener el servicio con la fechaProgramada mas reciente
            const dataFiltred2 = dataFiltred.filter((item) => item.fechaProgramada === dataFiltred.reduce((prev, current) => (prev.fechaProgramada > current.fechaProgramada) ? prev : current).fechaProgramada);
            //Obtenemos la fecha de hoy
            const today = new Date();
            //Obtenemos la fecha del servicio
            const serviceDate = new Date(dataFiltred2[0].fechaProgramada);
            // Si la fecha del servicio más reciente se encuentra en el rango de 1 semana después de la fecha de hoy, no se debe realizar un servicio
            if (serviceDate >= today && serviceDate <= new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5)) {
                return false;
            } else {
                return true;
            }
        } else {
            return;
        }
    }

    const changeSeenStatus = async (id) => {
        //Primero buscamos el historial de kilometraje
        const res = await fetch("api/Dashboard/HistorialesKilometraje/" + id);
        const data = await res.json();

        if (data.visto === false) {
            //Cambiamos el estado de visto a true
            data.visto = true;
            //Actualizamos el historial de kilometraje
            await fetch("api/Dashboard/HistorialesKilometraje/" + id, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            //Actualizamos el estado de la vista
            getMileageHistory();
        }
    }

    const transformDate = (date) => {
        if (date) {
            const dateArray = date.split("T");
            const dateArray2 = dateArray[0].split("-");

            const hours = dateArray[1].split(":");
            const hours2 = hours[0] + ":" + hours[1];

            return dateArray2[2] + "/" + dateArray2[1] + "/" + dateArray2[0] + " " + hours2;
        } else {
            return "";
        }
    }

    const calculateService = (mileageStart, mileageEnd) => {
        //Calculamos si es necesario un servicio
        //Si el kilometraje termina en un multiplo de 10000 se debe realizar un servicio
        const service = mileageEnd % 10000 === 0 ? true : false;
        //Si la diferencia entre el kilometraje final y el inicial es mayor o igual a 10000 se debe realizar un servicio
        const service2 = mileageEnd - mileageStart >= 10000 ? true : false;

        if (service || service2) {
            return true;
        } else {
            return false;
        }
    }

    useEffect(() => {
        getMileageHistory();
    }, []);

    return (
        <>
            <div className="fluid-content">
                <div className="row mt-2 mb-2">
                    <div className="col-md-12">
                        <h1 className="text-center text-white">
                            <i className="fas fa-tachometer-alt"></i> Dashboard
                        </h1>
                    </div>
                </div>
                <DashboardGraphics />
                <div className="row mt-2 mb-2">
                    <div className="col-md-12">
                        <h2 className="text-center text-white shadow-lg p-2">Notificaciones sobre vehiculos</h2>
                    </div>
                </div>
                <div className='row p-3'>
                    {
                        mileageHistory.map((item, index) => (
                            <div key={index} className="col-sm-3 mb-3">
                                <div className="card hoverWarning" data-bs-toggle="modal" data-bs-target="#modalNotificacion"
                                    onClick={
                                        () => {
                                            getMileageHistoryById(item.id);
                                            setVehicle(item.Vehiculo);
                                        }
                                    }
                                    //Si el item.visto es falso, le damos una sombra verde al card, sino, le damos una sombra normal
                                    style={
                                        {
                                            boxShadow: item.visto === false ?
                                                //Hacemos sombras difuminadas
                                                "0 0 1 0.2rem rgba(0, 255, 0, 0.25)" : "0 0 0 0.2rem rgba(0, 0, 0, 0.1)"
                                        }}>
                                    <div className="row" >
                                        <div className="col-md-4">
                                            <div className="container_img p-3">
                                                <img src={item.Vehiculo.imagen} alt="imagen" className="imgAutomovil mt-3 " style={{ position: "cover" }} />
                                            </div>
                                        </div>
                                        <div className="col-md-8">
                                            <div className="h5">
                                                {
                                                    item.visto === false ? (
                                                        <i className="fas fa-exclamation-triangle alertAnimation" style={{ color: "green" }}></i>
                                                    ) : null
                                                }<label className="text-center"><b>{item.Vehiculo.modelo}</b></label>
                                            </div>

                                            <div className="card-body">
                                                <i className="fas fa-user"></i> <b>Titular:</b> {item.Vehiculo.Usuario.nombre} {item.Vehiculo.Usuario.apePaterno} {item.Vehiculo.Usuario.apeMaterno}
                                                <br />
                                                <i className="fa-solid fa-user-tag"></i> <b>Comparte con: </b>
                                                {
                                                    item.Vehiculo.comparteCon === null || item.Vehiculo.comparteCon === "" ? " No compartido" : item.Vehiculo.comparteCon
                                                }
                                                <br />
                                                <i className="fas fa-tachometer-alt"></i> <b>Kilometraje:</b> {item.kilometrajeNuevo}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))
                    }
                </div>
                {/*Generando un apartado modal de bootstrap y su boton*/}
                <div className="modal fade" id="modalNotificacion" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Actualizaciones sobre el vehiculo
                                </h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"
                                    onClick={changeSeenStatus(mileageHistoryById.id)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {
                                    mileageHistoryById ? (
                                        <>
                                            <p>El kilometraje ha sido actualizado.</p>
                                            <p><b>Kilometraje anterior: </b>{mileageHistoryById.kilometrajeAnterior}</p>
                                            <p><b>Kilometraje nuevo: </b>{mileageHistoryById.kilometrajeNuevo}</p>
                                            <p><b>Fecha de actualización: </b>{transformDate(mileageHistoryById.fechaActualizacion)}</p>
                                            {
                                                calculateService(mileageHistoryById.kilometrajeAnterior, mileageHistoryById.kilometrajeNuevo) ? (
                                                    <>
                                                        {
                                                            mileageHistoryById.kilometrajeAnterior !== mileageHistoryById.kilometrajeNuevo ? (
                                                                <>
                                                                    {
                                                                        !validateService(vehicle.id)
                                                                            ? (
                                                                                <div className="alert alert-warning" role="alert">
                                                                                    <i className="fas fa-exclamation-triangle"></i> <b>Es necesario realizar un servicio</b>
                                                                                    <br />
                                                                                    <button
                                                                                        data-bs-dismiss="modal" aria-label="Close"
                                                                                        className="btn btn-warning mt-3"
                                                                                        onClick={() => {
                                                                                            window.location.href = "/services";
                                                                                        }}
                                                                                    >Ir a servicios</button>
                                                                                </div>
                                                                            ) : (
                                                                                <div className="alert alert-success" role="alert">
                                                                                    <i className="fas fa-check"></i> <b>No es necesario realizar un servicio ya que hace poco se realizó uno.</b>
                                                                                </div>
                                                                            )
                                                                    }
                                                                </>
                                                            ) : (<>
                                                                <div className="alert alert-success" role="alert">
                                                                    <i className="fas fa-check"></i> <b>No es necesario realizar un servicio</b>
                                                                </div>
                                                            </>)
                                                        }
                                                    </>
                                                ) : (
                                                    <div className="alert alert-success" role="alert">
                                                        <i className="fas fa-check"></i> <b>No es necesario realizar un servicio</b>
                                                    </div>
                                                )
                                            }
                                        </>
                                    ) : (<></>)
                                }
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={changeSeenStatus(
                                    mileageHistoryById.id
                                )} >Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
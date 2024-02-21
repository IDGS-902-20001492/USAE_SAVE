import { useEffect, useState } from "react";
import DashboardGraphics from "../components/DashboardGraphics"
import "./Dashboard.css";


const Dashboard = () => {

    const [mileageHistory, setMileageHistory] = useState([]);
    const [mileageHistoryById, setMileageHistoryById] = useState([]);

    const getMileageHistory = async () => {
        const res = await fetch("api/Dashboard/HistorialesKilometraje");
        const data = await res.json();
        setMileageHistory(data);
    }

    const getMileageHistoryById = async (id) => {
        const res = await fetch("api/Dashboard/HistorialesKilometraje/" + id);
        const data = await res.json();
        setMileageHistoryById(data);
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
                        <h2 className="text-center text-white">Notificaciones sobre vehiculos</h2>
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
                                        }
                                    }
                                >
                                    <div className="">
                                        <div className="text-center h5">
                                            {
                                                item.visto === false ? (
                                                    <i className="fas fa-exclamation-triangle alertAnimation" style={{ color: "green" }}></i>
                                                ) : null
                                            }<label className="text-center"><b>{item.Vehiculo.modelo}</b></label>
                                        </div>
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
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                                    <div className="alert alert-danger" role="alert">
                                                        <i className="fas fa-exclamation-triangle"></i> <b>Se recomienda realizar un servicio</b>
                                                    </div>
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Dashboard
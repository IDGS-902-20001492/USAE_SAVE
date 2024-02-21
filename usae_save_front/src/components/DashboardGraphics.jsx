/* eslint-disable no-unused-vars */
import { Chart, defaults } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import "./DashboardGraphics.css";
import { useEffect, useState } from 'react';

defaults.mantainAspectRatio = true;
defaults.responsive = true;
defaults.responsiveAnimationDuration = 1000;

const DashboardGraphics = () => {

    const [budgetData, setBudgetData] = useState([]);
    const [maintenancesData, setMaintenancesData] = useState([]);
    const [mileageData, setMileageData] = useState([]);
    const [mileageHistory, setMileageHistory] = useState([]);

    const getBudgetData = async () => {
        //Obtenemos el mes actual
        const date = new Date();
        const month = date.getMonth() + 1;

        const res = await fetch("api/Dashboard/PresupuestoPorMes/" + month);
        const data = await res.json();
        setBudgetData(data);
    }

    const getMaintenancesData = async () => {
        //Obtenemos el mes actual
        const date = new Date();
        const month = date.getMonth() + 1;

        const res = await fetch("api/Dashboard/Mantenimiento/" + month);
        const data = await res.json();
        setMaintenancesData(data);
    }

    const getMileageData = async () => {
        const res = await fetch("api/Dashboard/Kilometraje");
        const data = await res.json();
        setMileageData(data);
    }

    useEffect(() => {
        getBudgetData();
        getMaintenancesData();
        getMileageData();
    }, []);

    const transitions = {
        duration: 1000,
        easing: 'easeInOutCubic'
    };

    return (
        <>
            <div className='container-fluid fade-in'>
                <div className="row">
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className='card-header'>
                                <h5 className="text-center"><b>Presupuesto de este mes</b></h5>
                            </div>
                            <div className="card-body">
                                <Bar
                                    data={{
                                        labels: budgetData.map((item) => item.titularVehiculo),
                                        datasets: [
                                            {
                                                label: 'Presupuesto',
                                                data: budgetData.map((item) => item.presupuesto),
                                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                borderWidth: 1
                                            }
                                        ]
                                    }}

                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="text-center"><b>Servicios y reparaciones de este mes</b></h5>
                            </div>
                            <div className="card-body">
                                <Bar
                                    data={{
                                        labels: maintenancesData.map((item) => item.titularVehiculo),
                                        base: 0,
                                        datasets: [
                                            {
                                                label: 'Servicios',
                                                data: maintenancesData.map((item) => item.servicios),
                                                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                borderWidth: 1
                                            },
                                            {
                                                label: 'Reparaciones',
                                                data: maintenancesData.map((item) => item.reparaciones),
                                                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                                                borderColor: 'rgba(255, 99, 132, 1)',
                                                borderWidth: 1
                                            }
                                        ]
                                    }}

                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: true
                                            },
                                        }
                                    }}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="text-center"><b>Kilometraje de los vehículos</b></h5>
                            </div>
                            <div className="card-body">
                                <Bar
                                    data={{
                                        labels: mileageData.map((item) => item.titularVehiculo),
                                        datasets: [
                                            {
                                                label: 'Kilometraje',
                                                data: mileageData.map((item) => item.kilometraje),
                                                backgroundColor: 'rgba(119, 163, 69, 0.6)',
                                                borderColor: 'rgba(54, 162, 235, 1)',
                                                borderWidth: 1
                                            }
                                        ]
                                    }}

                                    options={{
                                        responsive: true,
                                        plugins: {
                                            legend: {
                                                display: false
                                            },
                                        },
                                        indexAxis: 'y'

                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DashboardGraphics
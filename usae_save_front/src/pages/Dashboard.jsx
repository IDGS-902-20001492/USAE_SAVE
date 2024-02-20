import DashboardGraphics from "../components/DashboardGraphics"
import "./Dashboard.css";


const Dashboard = () => {
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
            </div>
        </>
    )
}

export default Dashboard
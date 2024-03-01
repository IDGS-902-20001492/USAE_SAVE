import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <>
            {/*Diseñando una página de "Elemento no encontrado moderna y didactica"*/}
            <div className="container">
                <div className="row mt-3">
                    <div className="col-md-12 bg-light rounded">
                        <h1 className="text-center">404</h1>
                        <h2 className="text-center">Página no encontrada</h2>
                        <p className="text-center">Lo sentimos, la página que buscas no existe o ha sido movida.</p>
                        <center>
                            <button
                                className="btn btn-primary">
                                <Link to="/" className="text-white" style={{ textDecoration: "none" }}>
                                    Regresar al inicio
                                </Link>
                            </button>
                        </center>
                        <br />
                        <center>
                            <img src="/img/404.png" alt="Error 404" className="img-fluid" />
                        </center>

                    </div>
                </div>
            </div>

        </>
    )
}

export default NotFound
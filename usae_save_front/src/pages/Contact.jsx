import { ValidationError, useForm } from "@formspree/react";
import { Link } from "react-router-dom";

export const Contact = () => {

    const [state, handleSubmit] = useForm("xjvnrqod");

    if (state.succeeded) {
        return <>
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="alert alert-success mt-3" role="alert">
                        <h4 className="alert-heading">Mensaje enviado</h4>
                        <p>Gracias por contactarnos, tu mensaje ha sido enviado con éxito.</p>
                        <hr />
                        <p className="mb-0">Te responderemos lo más pronto posible.</p>
                        <br />
                        <button className="btn btn-success btn-lg">
                            <Link to="/" className="text-white" style={{ textDecoration: 'none' }}>Regresar</Link>
                        </button>
                    </div>
                </div>
            </div>
        </>
    }

    return (
        <div>
            <div className="container">
                <div className="row mt-3">
                    <div className="col-md-6 fade-in">
                        <div style={{ backgroundImage: 'url("./img/Instituto.gif")' }}>
                            <div className="card shadow-lg p-2" style={{ opacity: '90%' }}>
                                <div className="text-center bg-primary p-3">
                                    <h1 className="h3 text-white shadow-lg p-3">Contacto institucional</h1>
                                </div>
                                <div className="card-body shadow-lg">
                                    <h2 className="card-title"><b>Unidad de Servicios de Apoyo a la Educación Silao</b></h2>
                                    <br />
                                    <p className="card-text h5"><b>Contacto</b>: Javier Sánchez Cruz</p>
                                    <br />
                                    <p className="card-text h5"><b>Dirección</b>: C. 5 de Mayo 16, Centro, 36100 Silao de la Victoria, Gto.</p>
                                    <br />
                                    <p className="card-text h5"><b>Teléfono</b>: 472 722 3943</p>
                                    <br />
                                    <p className="card-text h5"><b>Correo</b>:
                                        <a href="j_sanchezc@seg.guanajuato.gob.mx" className="ms-1">
                                            j_sanchezc@seg.guanajuato.gob.mx
                                        </a>
                                    </p>
                                    <br />
                                    <p className="card-text h5"><b>Horario: 9:00 am a 4:00 pm</b></p>
                                    <div style={{ minWidth: '100%', minHeight: '200px' }}>
                                        <center><img src="./img/gto.png" alt="Gobierno del estado" style={{
                                            boxShadow: '0px 0px 5px 5px rgba(0, 0, 0, 0.3)',
                                            borderRadius: '50%',
                                        }} /></center>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 fade-in">
                        <div style={{ backgroundImage: 'url("./img/dev.png")' }} >
                            <div className="card shadow-lg p-2" style={{ opacity: '89%' }}>
                                <div className="text-center bg-primary p-3">
                                    <h1 className="h3 text-white shadow-lg p-3">Contacto de Desarrollador</h1>
                                </div>
                                <div className="card-body shadow-lg">
                                    <h2 className="card-title"><b>Desarrollador</b></h2>
                                    <br />
                                    <p className="card-text h5"><b>Nombre</b>: Yahir Bernardo Quiroz Ramírez</p>
                                    <br />
                                    <p className="card-text h5"><b>Teléfono</b>: 472 139 1755</p>
                                    <br />
                                    <p className="card-text h5"><b>Correo</b>:
                                        <a href="mailto:quirozbernardo@hotmail.com" className="ms-1">
                                            quirozbernardo@hotmail.com
                                        </a>
                                    </p>
                                    <br />
                                    <p className="card-text h5"><b>Horario de atención</b>: 8:00 am a 6:00 pm</p>
                                    <br />

                                    <form onSubmit={handleSubmit}>
                                        <label className="card-text h5"><b>Contacto directo</b>: </label>
                                        <br />
                                        <input type="text" className="email form-control mb-3" name="email" id="email" placeholder="Email" />
                                        <ValidationError
                                            prefix="Email"
                                            field="email"
                                            errors={state.errors}
                                        />
                                        <textarea className="message form-control h5" name="message" id="message" rows="5" placeholder="Escribe tu mensaje aquí"></textarea>
                                        <ValidationError
                                            prefix="Message"
                                            field="message"
                                            errors={state.errors}
                                        />
                                        <br />
                                        <button className="btn btn-primary" type="submit"><b className="h5">Enviar</b></button>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

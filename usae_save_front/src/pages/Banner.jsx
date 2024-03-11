import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { API_URL } from "../Api_url"

const Banner = () => {

    const [imagen1, setImagen1] = useState('')
    const [imagen2, setImagen2] = useState('')
    const [imagen3, setImagen3] = useState('')
    const [imagenes, setImagenes] = useState([])

    const addNewImage = async (idImg, imagen) => {

        let imagenBody = {
            id: 0,
            imagen: imagen
        }

        let imagenBody2 = {
            id: idImg,
            imagen: imagen
        }

        try {

            //Primero verificamos si la imagen ya existe con el idImg
            const resExiste = await fetch(API_URL + '/api/ImagenBanners/Exists/' + idImg);
            const existe = await resExiste.json();
            //Si existe la imagen, la actualizamos
            if (existe) {
                await fetch(API_URL + '/api/ImagenBanners/' + idImg, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(imagenBody2)
                }).then(() => {
                    sweetAlertPersonalizado('success', 'Imagen actualizada', 'La imagen se ha actualizado correctamente')
                })
            } else {
                //Si no existe, la creamos
                await fetch(API_URL + '/api/ImagenBanners', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(imagenBody)
                }).then(() => {
                    sweetAlertPersonalizado('success', 'Imagen subida', 'La imagen se ha subido correctamente')
                })
            }
            getImages()
        } catch (error) {
            console.log(error)
        }
    }

    const getImages = async () => {
        const res = await fetch(API_URL + '/api/ImagenBanners')
        const data = await res.json()
        setImagenes(data);
    }


    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = error => reject(error)
        })
    }

    const SWError = () => {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'No se ha seleccionado una imagen',
        })
    }

    const sweetAlertPersonalizado = (icon, title, text) => {
        Swal.fire({
            icon: icon,
            title: title,
            text: text
        })
    }

    useEffect(() => {
        getImages()
    }, [])

    return (
        <div>
            {/*Generando un form para actualizar las 3 imagenes del banner*/}
            <div className="container mt-3">
                <div className="row">
                    <div className="col-md-12 p-2 shadow-lg mt-3 mb-3 bg-light">
                        <h1 className="text-center">Cambiar imagenes</h1>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 shadow-lg">
                        <div className="text-center bg-info rounded p-2">
                            <h2>Imagen 1</h2>
                        </div>
                        <div className="rounded">
                            <h4 className="bg-light p-1">Imagen actual</h4>
                            {
                                imagenes[0] !== undefined ? (
                                    <img src={imagenes[
                                        0].imagen} alt="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/BannerGTOjpg.jpg" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                            <h4 className="bg-light p-1">Nueva imagen</h4>
                            {
                                imagen1 !== '' ? (
                                    <img src={imagen1} alt="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/Banner2.png" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                        </div>
                        <input type="file" className="form-control" id="imagen1"
                            onChange={
                                (e) => {
                                    toBase64(e.target.files[0]).then((res) => {
                                        setImagen1(res)
                                    })
                                }
                            } />
                        <button className="btn btn-primary mt-2 form-control mb-3"
                            onClick={
                                () => {
                                    if (imagen1 !== '') {
                                        addNewImage(1, imagen1)
                                    } else {
                                        SWError();
                                    }
                                }
                            }
                        >Subir</button>
                    </div>
                    <div className="col-md-4 shadow-lg">
                        <div className="text-center bg-info rounded p-2">
                            <h2>Imagen 2</h2>
                        </div>
                        <div className="rounded">
                            <h4 className="bg-light p-1">Imagen actual</h4>
                            {
                                imagenes[1] !== undefined ? (
                                    <img src={imagenes[
                                        1].imagen} alt="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/BannerGTOjpg.jpg" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                            <h4 className="bg-light p-1">Nueva imagen</h4>
                            {
                                imagen2 !== '' ? (
                                    <img src={imagen2} alt="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/Banner2.png" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                        </div>
                        <input type="file" className="form-control" id="imagen2"
                            onChange={
                                (e) => {
                                    toBase64(e.target.files[0]).then((res) => {
                                        setImagen2(res)
                                    })
                                }
                            } />
                        <button className="btn btn-primary mt-2 form-control mb-3"
                            onClick={
                                () => {
                                    if (imagen2 !== '') {
                                        addNewImage(2, imagen2)
                                    } else {
                                        SWError();
                                    }
                                }
                            }
                        >Subir</button>
                    </div>
                    <div className="col-md-4 shadow-lg">
                        <div className="text-center bg-info rounded p-2">
                            <h2>Imagen 3</h2>
                        </div>
                        <div className="rounded">
                            <h4 className="bg-light p-1">Imagen actual</h4>
                            {
                                imagenes[2] !== undefined ? (
                                    <img src={imagenes[
                                        2].imagen} alt="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/BannerGTOjpg.jpg" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                            <h4 className="bg-light p-1">Nueva imagen</h4>
                            {
                                imagen3 !== '' ? (
                                    <img src={imagen3} alt
                                        ="banner" className="img-fluid mb-3" />
                                ) : (
                                    <img src="./img/Banner2.png" alt="banner" className="img-fluid mb-3" />
                                )
                            }
                        </div>
                        <input type="file" className="form-control" id="imagen3"
                            onChange={
                                (e) => {
                                    toBase64(e.target.files[0]).then((res) => {
                                        setImagen3(res)
                                    })
                                }
                            } />
                        <button className="btn btn-primary mt-2 form-control mb-3"
                            onClick={
                                () => {
                                    if (imagen3 !== '') {
                                        addNewImage(3, imagen3)
                                    } else {
                                        SWError();
                                    }
                                }}
                        >Subir</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner
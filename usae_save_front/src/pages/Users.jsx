import { useEffect, useState } from "react"

const Users = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {
        try {
            const res = await fetch("/api/Usuarios");
            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <h1>Usuarios</h1>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Ape. Paterno</th>
                        <th>Ape. Materno</th>
                        <th>Edad</th>
                        <th>Centro de Trabajo</th>
                        <th>Zona</th>
                        <th>Nivel</th>
                        <th>Gobierno</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.nombre}</td>
                                <td>{user.apePaterno}</td>
                                <td>{user.apeMaterno}</td>
                                <td>{user.edad}</td>
                                <td>{user.centroTrabajo}</td>
                                <td>{user.zona}</td>
                                <td>{user.nivel}</td>
                                <td>{user.gobierno}</td>
                                <td>{user.email}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Users
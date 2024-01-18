import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Users from "./pages/Users";


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Login />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App

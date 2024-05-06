import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { arrowBack } from "../assets"
import '../styles/header.scss'

const Header = () => {
    const [userName, setUserName] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        /* setUserName(JSON.parse(sessionStorage.getItem('currentUser')).name) */
    }, [userName])

    function onLogout(){
        sessionStorage.clear();
        navigate('/')
    }

    return (
        <div className="flex justify-start header-container">
            <div className="col-2 flex items-center justify-start pointer" onClick={()=>{onLogout()}}>
                <img src={arrowBack} alt="user-profile" />
                <span className="mx-2 roboto-medium">Salir</span>
            </div>
        </div>
    )
}

export default Header
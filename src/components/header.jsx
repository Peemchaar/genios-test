import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { logout, user } from "../assets"
import '../styles/header.scss'
const Header = () => {
    const [userName, setUserName] = useState('');

    const navigate = useNavigate()

    useEffect(() => {
        setUserName(JSON.parse(sessionStorage.getItem('currentUser')).name)
    }, [userName])

    function onLogout(){
        sessionStorage.clear();
        navigate('/')
    }

    return (
        <div className="flex justify-end header-container">
            <div className="col-12 col-md-4 flex items-center justify-end px-3">
                <img className="pointer " src={user} alt="user-profile" />
                <span className="mx-2">{userName}</span>
                <img className="pointer mx-4" src={logout} alt="user-profile" onClick={() => {onLogout()}}/>
            </div>
        </div>
    )
}

export default Header
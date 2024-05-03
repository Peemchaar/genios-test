import React, { useRef, useState} from 'react';
import { useNavigate } from "react-router-dom"

const Signin = () => {
    const navigate = useNavigate()

    const formRef = useRef();
    const [form, setForm] = useState({ 
        email: '',
        password: '',
    })

    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const fetchUser = localStorage.getItem(form.email)
        if(fetchUser != null && JSON.parse(fetchUser).password === form.password){
            sessionStorage.setItem('currentUser', fetchUser)
            navigate('/dashboard')
        }
    }

    return(
        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-3 col-12 gap-8 px-3"
        >
            <label className="row ">
                <span className="mt-3 mb-2">Email</span>
                <input 
                    type="email" 
                    name="email" 
                    value={form.email} 
                    onChange={handlechange} 
                    placeholder="Email@example.com"
                    className="py-2 px-2 "
                />
            </label>
            <label className="row">
                <span className="mt-3 mb-2">Contraseña</span>
                <input 
                    type="password" 
                    name="password" 
                    value={form.password} 
                    onChange={handlechange} 
                    placeholder="*******"
                    className="py-2 px-2 "
                />
            </label>
            <button
                type="submit"
                className="mt-4 py-3 px-8 outline-none w-fit font-bold shadow-md shadow-primary rounded-xl"
            >
                Iniciar sesión
            </button>
        </form>
    )
}

export default Signin
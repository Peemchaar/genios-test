import React, { useRef, useState, useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { TextField } from '@mui/material';

const Signin = (props) => {
    const navigate = useNavigate()
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

    const formRef = useRef();
    const [form, setForm] = useState({ 
        email: '',
        password: '',
    })

    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value})
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fetchUser = localStorage.getItem(form.email)
        if(fetchUser != null){
            if(JSON.parse(fetchUser).password === form.password){
                sessionStorage.setItem('currentUser', fetchUser)
                navigate('/dashboard');
            }else{
                setPasswordError(true)
            }
        }else{
            setEmailError(true)  
        }
    }

    useEffect(() => {

    }, [emailError, passwordError])

    return(
        <form 
            ref={formRef}
            className='mt-3 col-12 gap-8 px-3 login-form flex flex-col'
            component='form'
            autoComplete='off'
            onSubmit={handleSubmit}
        >
            <TextField
                fullWidth
                id="standard"
                name="email"
                label="Correo electrónico" 
                variant="standard"
                margin="normal"
                //value={form.email} 
                onChange={handlechange}
                error={emailError}
                helperText={ emailError? 'Este usuario no existe en el sistema' : ''}
            />
            <TextField
                fullWidth
                id="standard-password"
                name="password"
                label="Contraseña" 
                variant="standard"
                margin="normal"
                //value={form.password} 
                onChange={handlechange}
                error={passwordError}
                type='password'
                helperText={ passwordError && 'Contraseña incorrecta'}
            />
            <button
                type="submit"
                className=" py-3 px-8 custom-btn flex items-center justify-center roboto-medium"
            >
                Iniciar sesión
            </button>
            <span 
                className='roboto-medium mt-2 flex self-center pointer'
                onClick={() => {props.register()}}
            >
                Registrarme
            </span>
        </form>
    )
}

export default Signin
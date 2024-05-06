import React, { useRef, useState} from 'react';
import { TextField } from '@mui/material';

const Signup = (props) => {

    const formRef = useRef();
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    })

    const handlechange = (e) => {
        const { name, value } = e.target;
        setForm({...form, [name]: value})
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(localStorage.getItem(form.email) == null){
            localStorage.setItem(
                form.email, 
                JSON.stringify({ 
                    'name' : form.name,
                    'password' : form.password 
                })
            );
            props.submited()
        }    
    }

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
                id="name"
                name="name"
                label="Nombre y Apellido" 
                variant="standard"
                margin="normal"
                required
                onChange={handlechange}
            />
            <TextField
                fullWidth
                id="email"
                name="email"
                label="Correo electrónico" 
                variant="standard"
                margin="normal"
                required
                onChange={handlechange}
            />
            <TextField
                fullWidth
                id="password"
                name="password"
                label="Contraseña" 
                variant="standard"
                margin="normal"
                required
                onChange={handlechange}
            />
            <button
                type="submit"
                className=" py-3 px-8 custom-btn flex items-center justify-center roboto-medium"
            >
                Crear usuario
            </button>
            <span 
                className='roboto-medium mt-2 flex self-center pointer'
                onClick={() => {props.submited()}}
            >
                Cancelar registro
            </span>
        </form>
    )
}

export default Signup
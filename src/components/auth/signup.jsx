import React, { useRef, useState} from 'react';

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
          onSubmit={handleSubmit}
          className="mt-3 col-12 gap-8 px-3"
        >   
            <label className="row ">
                <span className="mt-3 mb-2">Nombre</span>
                <input 
                    type="text" 
                    name="name" 
                    value={form.name} 
                    onChange={handlechange} 
                    placeholder="Jhon Doe"
                    className="py-2 px-2 "
                />
            </label>
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
                Registrarse
            </button>
        </form>
    )
}

export default Signup
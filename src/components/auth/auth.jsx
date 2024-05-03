import React, {useEffect, useState} from 'react';

import Signin from "./signin"
import Signup from "./signup"

const Auth = () => {
    const [formType, setformType] = useState('signin');
    
    function onRegister(){
        setformType('signin')
    }
    useEffect(() => {
        console.log(formType)
    }, [formType])
    return (
        <div className="container">
            <div className="card mt-2">
                <div className="card-header">
                    <div className="btn-group col-12" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-primary"
                            onClick={() => {setformType('signin')}}
                        >
                            Ingresar
                        </button>
                        <button type="button" className="btn btn-info"
                             onClick={() => {setformType('signup')}}
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
                <div className="card-body">
                    {
                        formType == 'signin'?
                        <Signin /> :
                        <Signup submited={onRegister}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Auth
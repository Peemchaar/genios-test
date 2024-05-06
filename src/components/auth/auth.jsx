import React, {useEffect, useState} from 'react';
import '../../styles/login.scss';
import Signin from "./signin"
import Signup from "./signup"
import { loginBg, pedroLogo } from '../../assets';

const Auth = () => {
    const [formType, setformType] = useState('signin');
    
    useEffect(() => {
       
    }, [formType])
    return (
        <div className="login-container flex justify-center">
            <div className="img-container">
                <img src={loginBg} alt="login-background" />
            </div>
            <div className="form-container flex justify-center items-center">
                <div className="inner-container flex flex-col">
                    <img className='self-center' src={pedroLogo} alt="pedro-pe" />
                    {
                        formType == 'signin'?
                        <Signin register={() => {setformType('signup')}}/> :
                        <Signup submited={() => {setformType('signin')}}/>
                    }
                </div>
            </div>
        </div>
    )
}

export default Auth
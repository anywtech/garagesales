import React, { useState } from 'react'
import './CSS/Login.css'


const Login = () => {


    const [state, setState] = useState('Sign Up')

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        email: ""
    })

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const login = async () => {

        let resData;

        await fetch('http://localhost:4000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((res) => res.json()).then((data) => resData = data)

        if (resData.success) {
            localStorage.setItem('auth-token', resData.token);
            window.location.replace('/')
        }
        else {
            alert(resData.errors)
        }

    }

    const signup = async () => {
        console.log(formData)

        let resData;
        await fetch('http://localhost:4000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData),
        }).then((res) => res.json()).then((data) => resData = data)

        if (resData.success) {
            localStorage.setItem('auth-token', resData.token);
            window.location.replace('/')
        }
        else {
            alert(resData.errors)
        }
    }

    return (
        <div className="login">
            <div className="login-container">
                <h1>{state}</h1>
                <div className="login-fields">
                    {state === 'Sign Up' ? <input name='username' onChange={changeHandler} value={formData.username} type="text" placeholder='You Name' /> : <></>}
                    <input name="email" value={formData.email} onChange={changeHandler} type="text" placeholder='Email Address' />
                    <input name="password" value={formData.password} onChange={changeHandler} type="text" placeholder='Password' />
                    <button onClick={() => { state === "Login" ? login() : signup() }}>Continue</button>

                </div>

                {state === 'Sign Up' ? <p className="login-login">Already have an account? <span onClick={() => { setState('Login') }}>Login</span></p> : <p className="login-login">Create an account? <span onClick={() => { setState('Sign Up') }}>Click here</span></p>}

                <div className="login-agree">
                    <input type="checkbox" name='' id='' />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    )
}

export default Login
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext.js";
import { checkFormValidity } from "../utils.js";

export const Login = () => {
    const navigate = useNavigate();
    const { store, actions } = useContext(Context);
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handleEmail = (event) => {setEmail(event.target.value)}
    const handlePassword = (event) => {setPassword(event.target.value)}

    useEffect(() => {
        if (store.isLogged) {
            navigate('/home');
        }
    }, [store.isLogged, navigate]);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!checkFormValidity(event)) return

        const body = {
            email: email,
            password: password
        }

        const response = await actions.login(body)
        if (response.ok) {
            navigate("/home")
        }

    }

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh', width: '100%' }}>
            <h1 className="mb-4">Login</h1>
            <form action="submit" onSubmit={handleLogin} className="w-100 px-3" style={{ maxWidth: '600px' }}>
                <img src="https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg" className="mb-4 d-block mx-auto" alt="User" style={{ height: '60px', width: '60px', borderRadius: '50%' }} />
                <div className="input-group mt-3 w-100">
                    <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={handleEmail} required autoComplete="email" />
                </div>
                <div className="input-group mt-3 mb-3 w-100">
                    <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={handlePassword} required autoComplete="current-password" />
                </div>
                <button type="submit" className="btn btn-outline-warning mt-3 w-100">Login</button>
            </form>
            <div className="d-flex mt-3">
                <p className="mb-0">Don't have an account? </p>
                <a href="#" className="ms-2 link-light" onClick={() => navigate(`/`)}>
                    Sign up
                </a>
            </div>
        </div>
    ); 
}
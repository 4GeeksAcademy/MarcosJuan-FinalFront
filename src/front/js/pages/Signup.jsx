import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { checkFormValidity } from "../utils";

export const Signup = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context)
    const [ firstName, setfirstName ] = useState('');
    const [ email, setEmail ] = useState('');
    const [ password, setPassword ] = useState('');

    const handlefirstName = (event) => { setfirstName(event.target.value) }
    const handleEmail = (event) => { setEmail(event.target.value) }
    const handlePassword = (event) => { setPassword(event.target.value) }

    const handleSignup = async (event) => {
        event.preventDefault();
        if (!checkFormValidity(event)) return

        const body = {
            firstName: firstName,
            email: email,
            password: password,
        }

        const response = await actions.signup(body)
        if (response.ok) {
            navigate("/login")
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '70vh' }}>
            <h1>Sign up</h1>
            <form action="submit" onSubmit={handleSignup} className="w-100 px-3" style={{ maxWidth: '600px' }}>
                <div className="input-group mt-3">
                    <span className="input-group-text"><i className="fa-solid fa-user"></i></span>
                    <input type="text" className="form-control" placeholder="Name" value={firstName} onChange={handlefirstName} required autoComplete="firstName" />
                </div>
                <div className="input-group mt-3">
                    <span className="input-group-text"><i className="fa-solid fa-envelope"></i></span>
                    <input type="email" className="form-control" placeholder="Email" value={email} onChange={handleEmail} required autoComplete="email" />
                </div>
                <div className="input-group mt-3 mb-3">
                    <span className="input-group-text"><i className="fa-solid fa-lock"></i></span>
                    <input type="password" className="form-control" placeholder="Password" value={password} onChange={handlePassword} required autoComplete="password" />
                </div>
                <button type="submit" className="btn btn-outline-warning mt-3 w-100">Sign up</button>
            </form>
            <div className="d-flex mt-3">
                <p className="mb-0">Already have an account? </p>
                <a href="#" className="ms-2 link-light" onClick={() => navigate(`/login`)}>
                    Login
                </a>
            </div>
        </div>
    );
}
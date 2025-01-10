import React, { useActionState, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const AddContacts = () => {
    const [ name, setName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ phone, setPhone ] = useState("");
    const [ address, setAddress ] = useState("");

    const { store, actions } = useContext(Context)
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const dataToSend = { name, email, phone, address };
        actions.createContact(dataToSend)
        navigate("/contacts")
    }

    return (
        <div>
            <h1 className="mt-4 d-flex justify-content-center">Add a new contact</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="exampleInputName" className="mb-2 ms-5">Name</label>
                    <input type="text" className="mb-3 ms-5 form-control" placeholder="Enter name" value={name} onChange={(event) => setName (event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputEmail" className="mb-2 ms-5">Email</label>
                    <input type="email" className="mb-3 ms-5 form-control" placeholder="Enter email" value={email} onChange={(event) => setEmail (event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputPhone" className="mb-2 ms-5">Phone</label>
                    <input type="text" className="mb-3 ms-5 form-control" placeholder="Enter phone" value={phone} onChange={(event) => setPhone (event.target.value)} />
                </div>
                <div className="form-group">
                    <label htmlFor="exampleInputAddress" className="mb-2 ms-5">Address</label>
                    <input type="text" className="mb-3 ms-5 form-control" placeholder="Enter address" value={address} onChange={(event) => setAddress (event.target.value)} />
                </div>
                <button type="submit" className="mt-2 ms-5 me-5 btn btn-primary w-100">Save</button>
            </form>
            <a className="ms-5" onClick={() => navigate("/contacts")}>or get back to contacts</a>
        </div>
    )
}
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Starships = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();

    const handleImagen = (event) => {
        event.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'
    }
    
    return (
        <div className="container-fluid px-0 bg-dark">
            <h1 className="text-center text-white mb-5">Starships</h1>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: "1rem" }}>
                {store.starships.map((starship, index) => (
                    <div className="card h-100" key={index} style={{ width: "18rem", margin: "0 0.5rem" }}>
                        <img src={`https://starwars-visualguide.com/assets/img/starships/${starship.uid}.jpg`} className="card-img-top" alt={starship.name} style={{ height: "300px", objectFit: "cover" }} onError={handleImagen}/>
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold">{starship.name}</h5>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/starships/detail/${starship.uid}`)}>
                                Details
                            </button>
                            <button type="button" className="btn btn-outline-danger" onClick={() => actions.addFavorites(starship.name)}>
                                <i className="fa-regular fa-heart"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
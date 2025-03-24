import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { useProtectedPage } from "../hooks/useProtectedPage";

export const Planets = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const user = useProtectedPage();

    const handleImagen = (event) => {
        event.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'
    }


    return (
        <div className="container-fluid px-0 bg-dark">
            <h1 className="text-center text-white mb-5">Planets</h1>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: "1rem" }}>
                {store.planets.map((planet, index) => (
                    <div className="card h-100" key={index} style={{ width: "18rem", margin: "0 0.5rem" }}>
                        <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/planets/${planet.uid}.jpg`} className="card-img-top" alt={planet.name} style={{ height: "300px", objectFit: "cover" }}  onError={handleImagen}/>
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold">{planet.name}</h5>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/planets/detail/${planet.uid}`)}>
                                Details
                            </button>
                            <button type="button" className="btn btn-outline-danger" onClick={() => actions.addFavorites(planet.name)}>
                                <i className="fa-regular fa-heart"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
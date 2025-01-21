import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const DetailStarships = () => {
    const { store, actions } = useContext(Context);
    const { uid } = useParams();
    const starship = store.detailStarships;
    
    useEffect(() => {
        actions.getDetailStarships(uid);
    }, [uid])

    const handleImagen = (event) => {
        event.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'
    }

    return (
        <div className="card bg-dark" style={{ maxWidth: "1500px", borderRadius: "0" }}>
            <div className="card-head">
                <h2 className="card-title ms-5 mt-4 mb-4 text-white">{starship.name}</h2>
            </div>
            <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-start">
                    <img src={`https://starwars-visualguide.com/assets/img/starships/${uid}.jpg`} className="card-img-top ms-5" alt={starship.name} style={{ height: "500px", width: "350px", objectFit: "cover" }} onError={handleImagen}/>
                </div>
                <div className="col-md-8">
                    <div className="card-body text-white">
                        <p className="card-text"><strong>Model: </strong>{starship.model}</p>
                        <p className="card-text"><strong>Starship Class: </strong>{starship.starship_class}</p>
                        <p className="card-text"><strong>Manufacturer: </strong>{starship.manufacturer}</p>
                        <p className="card-text"><strong>Cost in Credits: </strong>{starship.cost_in_credits}</p>
                        <p className="card-text"><strong>Length: </strong>{starship.length}</p>
                        <p className="card-text"><strong>Crew: </strong>{starship.crew}</p>
                        <p className="card-text"><strong>Passengers: </strong>{starship.passengers}</p>
                        <p className="card-text"><strong>Max Atmosphering Speed: </strong>{starship.max_atmosphering_speed}</p>
                        <p className="card-text"><strong>Hyperdrive Rating: </strong>{starship.hyperdrive_rating}</p>
                        <p className="card-text"><strong>MGLT: </strong>{starship.MGLT}</p>
                        <p className="card-text"><strong>Cargo Capacity: </strong>{starship.cargo_capacity}</p>
                        <p className="card-text"><strong>Consumables: </strong>{starship.consumables}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
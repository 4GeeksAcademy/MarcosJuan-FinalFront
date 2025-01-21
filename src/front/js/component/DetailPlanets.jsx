import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const DetailPlanets = () => {
    const { store, actions } = useContext(Context);
    const { uid } = useParams();
    const planet = store.detailPlanets;
    
    useEffect(() => {
        actions.getDetailPlanets(uid);
    }, [uid])

    const handleImagen = (event) => {
        event.target.src = 'https://starwars-visualguide.com/assets/img/big-placeholder.jpg'
    }
    
    return (
        <div className="card bg-dark" style={{ maxWidth: "1500px", borderRadius: "0" }}>
            <div className="card-head">
                <h2 className="card-title ms-5 mt-4 mb-4 text-white">{planet.name}</h2>
            </div>
            <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-start">
                    <img src={`https://starwars-visualguide.com/assets/img/planets/${uid}.jpg`} className="card-img-top ms-5" alt={planet.name} style={{ height: "500px", width: "350px", objectFit: "cover" }} onError={handleImagen}/>
                </div>
                <div className="col-md-8">
                    <div className="card-body text-white">
                        <p className="card-text"><strong>Diameter: </strong>{planet.diameter}</p>
                        <p className="card-text"><strong>Rotation Period: </strong>{planet.rotation_period}</p>
                        <p className="card-text"><strong>Orbital Period: </strong>{planet.orbital_period}</p>
                        <p className="card-text"><strong>Gravity: </strong>{planet.gravity}</p>
                        <p className="card-text"><strong>Population: </strong>{planet.population}</p>
                        <p className="card-text"><strong>Climate: </strong>{planet.climate}</p>
                        <p className="card-text"><strong>Terrain: </strong>{planet.terrain}</p>
                        <p className="card-text"><strong>Surface Water: </strong>{planet.surface_water}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
import React, { useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useParams } from "react-router-dom";

export const DetailCharacters = () => {
    const { store, actions } = useContext(Context);
    const { uid } = useParams();
    const character = store.detailCharacters;

    useEffect(() => {
        actions.getDetailCharacters(uid);
    }, [uid])

    return (
        <div className="card bg-dark" style={{ maxWidth: "1500px", borderRadius: "0" }}>
            <div className="card-head">
                <h2 className="card-title ms-5 mt-4 mb-4 text-white">{character.name}</h2>
            </div>
            <div className="row g-0">
                <div className="col-md-4 d-flex justify-content-center align-items-start">
                    <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${uid}.jpg`} className="card-img-top ms-5" alt={character.name} style={{ height: "500px", width: "350px", objectFit: "cover" }} />
                </div>
                <div className="col-md-8">
                    <div className="card-body text-white">
                        <p className="card-text"><strong>Height: </strong>{character.height}</p>
                        <p className="card-text"><strong>Mass: </strong>{character.mass}</p>
                        <p className="card-text"><strong>Hair color: </strong>{character.hair_color}</p>
                        <p className="card-text"><strong>Skin color: </strong>{character.skin_color}</p>
                        <p className="card-text"><strong>Eye color: </strong>{character.eye_color}</p>
                        <p className="card-text"><strong>Birth year: </strong>{character.birth_year}</p>
                        <p className="card-text"><strong>Gender: </strong>{character.gender}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
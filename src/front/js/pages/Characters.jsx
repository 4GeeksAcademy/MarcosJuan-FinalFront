import React, { useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { useProtectedPage } from "../hooks/useProtectedPage";

export const Characters = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const user = useProtectedPage();

    return (
        <div className="container-fluid px-0 bg-dark">
            <h1 className="text-center text-white mb-5">Characters</h1>
            <div className="d-flex flex-wrap justify-content-center" style={{ gap: "1rem" }}>
                {store.characters.map((character, index) => (
                    <div className="card h-100" key={index} style={{ width: "18rem", margin: "0 0.5rem" }}>
                        <img src={`https://raw.githubusercontent.com/tbone849/star-wars-guide/refs/heads/master/build/assets/img/characters/${character.uid}.jpg`} className="card-img-top" alt={character.name} />
                        <div className="card-body d-flex flex-column">
                            <h5 className="card-title fw-bold">{character.name}</h5>
                        </div>
                        <div className="card-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-secondary" onClick={() => navigate(`/characters/detail/${character.uid}`)}>
                                Details
                            </button>
                            <button type="button" className="btn btn-outline-danger" onClick={() => actions.addFavorites(character.name)}>
                                <i className="fa-regular fa-heart"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

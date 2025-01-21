import React, { useContext } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";

export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
		<div className="container-fluid px-0 d-flex justify-content-center align-items-center bg-dark">
			<img src="https://i.blogs.es/1da08b/1366_2000-9-/1366_2000.jpeg" alt="Imagen Starwars" width="1200" height="660"  />
		</div>
	);
};

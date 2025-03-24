import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";
import { useContext } from "react";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate()

	const handleLogout = async () => {
		await actions.logout()
		navigate('/login')
	}

	return (
		<div className="container-fluid px-0">
			<nav className="navbar bg-dark">
				<a className="navbar-brand" href="#">
					<img src="https://img.icons8.com/?size=100&id=21576&format=png&color=000000" alt="Logo Starwars" width="110" height="80" className="ms-5" onClick={() => navigate("/")}/>
				</a>
				<ul className="nav justify-content-end">
					<li className="nav-item">
						<Link className="nav-link text-secondary" to="/characters">
							Characters
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-secondary" to="/planets">
							Planets
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-secondary" to="/starships">
							Starships
						</Link>
					</li>
					<li className="nav-item">
						<Link className="nav-link text-secondary" to="/contacts">
							Contacts
						</Link>
					</li>
					<div className="btn-group">
						<button className="btn btn-warning dropdown-toggle me-4" type="button" data-bs-toggle="dropdown" aria-expanded="false">
							Favorites
						</button>
						<ul className="dropdown-menu dropdown-menu-end">
							{store.favorites.length > 0 ? (
								store.favorites.map((item, index) => (
									<li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
										<span> {item}</span>
										<span onClick={() => actions.removeFavorites(item)}>
											<i className="fas fa-trash text-warning ms-2"></i>
										</span>
									</li>
								))
							) : (
								<li className="dropdown-item text-center text-muted">No favorites added</li>
							)}
						</ul>
					</div>
					<li className="nav-item">
						<button type="button" className="btn btn-outline-warning me-4" onClick={handleLogout}>Logout</button>
					</li>
				</ul>
			</nav>
		</div >
	);
};
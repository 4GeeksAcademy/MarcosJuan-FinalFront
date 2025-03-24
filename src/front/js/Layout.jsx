import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import injectContext from "./store/appContext";
//Custom Component
import ScrollToTop from "./component/ScrollToTop.jsx";
import { BackendURL } from "./component/BackendURL.jsx";
import { Navbar } from "./component/Navbar.jsx";
import { Footer } from "./component/Footer.jsx";
import { ContactsList } from "./pages/ContactsList.jsx";
import { AddContacts } from "./component/AddContacts.jsx";
import { EditContacts } from "./component/EditContacts.jsx";
//Custom Pages
import { Demo } from "./pages/demo.js";
import { Single } from "./pages/single.js";
import { Home } from "./pages/Home.jsx";
import { Characters } from "./pages/Characters.jsx";
import { Planets } from "./pages/Planets.jsx";
import { Starships } from "./pages/Starships.jsx";
import { DetailCharacters } from "./component/DetailCharacters.jsx";
import { DetailPlanets } from "./component/DetailPlanets.jsx";
import { DetailStarships } from "./component/DetailStarships.jsx";
import { Error404 } from "./pages/Error404.jsx"
import { Login } from "./pages/Login.jsx";
import { Signup } from "./pages/Signup.jsx";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";
    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div className="d-flex flex-column min-vh-100 bg-dark text-white">
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route path="/home" element={<Home />} />
                        <Route path="/contacts" element={<ContactsList />} />
                        <Route path="/add-contact" element={<AddContacts />} />
                        <Route path="/edit-contact" element={<EditContacts />} />
                        <Route path="/characters" element={<Characters />} />
                        <Route path="/characters/detail/:uid" element={<DetailCharacters />} />
                        <Route path="/planets" element={<Planets />} />
                        <Route path="/planets/detail/:uid" element={<DetailPlanets />} />
                        <Route path="/starships" element={<Starships />} />
                        <Route path="/starships/detail/:uid" element={<DetailStarships />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/" element={<Signup />} />
                        <Route path="*" element={<Error404 />} />
                    </Routes>
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);

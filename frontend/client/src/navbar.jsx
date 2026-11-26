// navbar funtion

import React from "react";
import { NavLink } from "react-router-dom";
import "./navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="nav-links">
                <li><NavLink to="/" end>Home</NavLink></li>
                <li><NavLink to="/how-to-play">How to Play</NavLink></li>
                <li><NavLink to="/about">About</NavLink></li>
                <li><NavLink to="/settings">Settings</NavLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
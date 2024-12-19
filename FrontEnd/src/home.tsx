import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import axios, {AxiosError} from "axios";
import './home.css';

function Home() {
    const pathSegments = window.location.pathname.split('/');
    const userID = pathSegments[1];
    
    return (
        <div className="home-container">
            <div className="home-card">
                <div className="home-header">
                    <h1 className="home-title">Welcome!</h1>
                </div>
		    
                <div className="nav-links">
                    <a href={`/${userID}/addIngredient`} className="nav-link">Add New Ingredients</a>
                    <a href={`/${userID}/updateIngredient`} className="nav-link">Update Your Ingredients</a>
                    <a href={`/${userID}/getMeal`} className="nav-link">Get Your Meal</a>
                </div>
                
                <div className="home-footer">
                    <div className="dotted-line"></div>
                    <a href="/login" className="logout-button">
                        Logout
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Home;

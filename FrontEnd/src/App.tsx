import React from 'react';
import { BrowserRouter as Router, Route, Navigate, Routes, Link, useNavigate, useParams } from 'react-router-dom';
import Login from './login'
import Home from './home';
import ValidateUserRoute from './ValidateUserRoute';
import AddIngredient from './AddIngredient';
import GetMeal from './getMeal';
import UpdateIngredient from './updateIngredient';


function App() {
  // put /:userID in front of the route parameter when you guys integrate the route
  // and remeber to put the /:userID when navigating between routes
  // also use the <ValidateUserRoute>
  // these are for the authentication purpose
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/:userID/home" element={<ValidateUserRoute><Home /></ValidateUserRoute>} />
        <Route path="/:userID/addIngredient" element={<ValidateUserRoute><AddIngredient /></ValidateUserRoute>} />
        <Route path="/:userID/getMeal" element={<ValidateUserRoute><GetMeal /></ValidateUserRoute>} />
        <Route path="/:userID/updateIngredient" element={<ValidateUserRoute><UpdateIngredient /></ValidateUserRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

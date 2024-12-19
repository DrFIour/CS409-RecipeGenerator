import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import './index.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


interface Meal {
  meal: string;
  ingredients: [string];
  instructions: string;
}
const APIurl = "https://cs409-final-omega.vercel.app/api";
const GetMeal: React.FC = () => {
  const [meal, setMeal] = useState<Meal | null>(null);
  const [previousMeals, setPreviousMeals] = useState<string[]>([]); 
  const [comment, setComment] = useState('');
  const navigate = useNavigate();
  const userID = window.location.pathname.split('/')[1];

  const fetchMeal = async () => {
    try {
      const response = await axios.post(APIurl + `/get_meal/${userID}`, { previousMeals, comment });
      setMeal(response.data.data);
      setPreviousMeals((prev) => [...prev, response.data.data.meal]); 
    } catch (error) {
      alert('Error generating meal. Please try again later.');
    }
  };

  return (
    <div className="recipe-container">
      <Card className="recipe-card">
        <div className="recipe-header">
          <button
            onClick={() => navigate(`/${userID}/home`)}
            className="back-button"
          >
            ← Back
          </button>
          <h1 className="recipe-title">Let's Get Your Meal</h1>
        </div>

        <div className="user-input-section">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any specific preferences for your meal?"
            className="user-comment-input"
          />
          <button
            onClick={fetchMeal}
            className="generate-meal-button"
          >
            Generate Meal
          </button>
        </div>

        {meal && (
          <div className="meal-details">
            <h2 className="meal-name">{meal.meal}</h2>
            <h3>Ingredients</h3>
            <ul>
              {meal.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
            <h3>Instructions</h3>
            <p>{meal.instructions}</p>
          </div>
        )}

        {meal && (
          <button
            onClick={() => fetchMeal()}
            className="regenerate-button"
          >
            Get a New Meal
          </button>
        )}
      </Card>
    </div>
  );
};

export default GetMeal;

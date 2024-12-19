import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './updateIngredient.css';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

const UNITS = [
  '',  // For items without units
  'Grams',
  'Kilograms',
  'Pound',
  'Ounces',
  'mL',
  'L',
  'Pieces'
];

const UpdateIngredient: React.FC = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const navigate = useNavigate();
  const userID = window.location.pathname.split('/')[1];
  const APIurl = "https://cs409-final-omega.vercel.app/api";
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await axios.get(APIurl + `/users/${userID}`);
        const ingredients = response.data.data.ingredients;
        const extractedIngredients = Object.entries(ingredients).map(([name, amount]) => {
          const [quantity, unit] = (amount as string).split(' ');
          return { name, quantity, unit: unit || '' };
        });
        setIngredients(extractedIngredients);
      } catch (error) {
        alert('Failed to load ingredients. Please try again.');
      }
    };

    fetchIngredients();
  }, []);

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const submitIngredients = async () => {
    const ingredientsObj: { [key: string]: string } = {};
    ingredients.forEach(ing => {
      const unit = ing.unit === '' ? '' : ` ${ing.unit}`;
      ingredientsObj[ing.name.trim()] = `${ing.quantity}${unit}`.trim();
    });

    const ingredientsData = {
      ingredients: ingredientsObj
    };

    try {
      const response = await axios.patch(APIurl + `/users/${userID}`, ingredientsData);
      if (response.status === 201) {
        alert('Ingredients updated successfully!');
      } else {
        alert('Failed to update ingredients. Please try again.');
      }
    } catch (error) {
      alert(error);
    }
  };


  return (
    <div className="reader-container">
      <Card className="reader-card">
        <div className="reader-header">
          <button
            onClick={() => navigate(`/${userID}/home`)}
            className="back-button"
          >
            ← Back
          </button>
          <h1 className="reader-title">Update Ingredients</h1>
          <p>Adjust quantities, units, or remove ingredients</p>
        </div>

        <div className="reader-content">
          <div className="ingredients-display">
            <h2 className="ingredients-title">Ingredients:</h2>
            {ingredients.map((ingredient, index) => (
              <div key={index} className="ingredient-display-group">
                <input
                  type="text"
                  className="display-name"
                  value={ingredient.name}
                  readOnly
                />
                <input
                  type="number"
                  className="display-quantity"
                  value={ingredient.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  min="1"
                  step="1"
                />
                <select
                  className="unit-select"
                  value={ingredient.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                >
                  {UNITS.map((unit) => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => removeIngredient(index)}
                  className="remove-button"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="reader-footer">
          <div className="dotted-line"></div>
          <button
            onClick={submitIngredients}
            className="submit-button"
          >
            Update Ingredients
          </button>
        </div>
      </Card>
    </div>
  );
};

export default UpdateIngredient;

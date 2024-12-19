import React, { useState, useEffect } from 'react';
import { Card } from "./ui/card";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import './index.css';

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

const AddIngredient: React.FC = () => {
  const APIurl = "https://cs409-final-omega.vercel.app/api"
  const navigate = useNavigate();
  const userID = window.location.pathname.split('/')[1];

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' }
  ]);

  const [existingIngredients, setExistingIngredients] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchExistingIngredients = async () => {
      try {
        const response = await axios.get(APIurl + `/users/${userID}`);
        setExistingIngredients(response.data.data.ingredients || {});
      } catch (error) {
        console.error('Error fetching existing ingredients:', error);
      }
    };

    fetchExistingIngredients();
  }, [userID]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index);
      setIngredients(newIngredients);
    }
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = ingredients.map((ingredient, i) => {
      if (i === index) {
        return { ...ingredient, [field]: value };
      }
      return ingredient;
    });
    setIngredients(newIngredients);
  };

  const submitIngredients = async () => {
    const validIngredients = ingredients.filter(
      ing => ing.name.trim() !== '' && ing.quantity.trim() !== ''
    );

    if (validIngredients.length === 0) {
      alert('Please enter at least one ingredient with quantity!');
      return;
    }

    const updatedIngredients = { ...existingIngredients };
    console.log(updatedIngredients);
    validIngredients.forEach(ing => {
      const unit = ing.unit === '' ? '' : ` ${ing.unit}`;
      updatedIngredients[ing.name.trim()] = `${ing.quantity}${unit}`.trim();
    });

    const ingredientsData = {
      ingredients: updatedIngredients
    };
    console.log(ingredientsData);
    try {
      const response = await axios.patch(APIurl + `/users/${userID}`, ingredientsData);

      if (response.status === 201) {
        alert('Ingredients added successfully!');
      } else {
        alert('Failed to add ingredients. Please try again.');
      }

    }
    catch (error) {
      alert(error);
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
          <h1 className="recipe-title">Add New Ingredients</h1>
          <p>List your ingredients below</p>
        </div>

        <div className="ingredients-list">
          {ingredients.map((ingredient, index) => (
            <div key={index} className="ingredient-input-group">
              <input
                type="text"
                className="ingredient-name-input"
                placeholder="Enter ingredient"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
              />
              <input
                type="number"
                className="quantity-input"
                placeholder="Qty"
                min="1"
                step="1"
                value={ingredient.quantity}
                onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
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

        <button
          onClick={addIngredient}
          className="add-button"
        >
          + Add Ingredient
        </button>

        <div className="recipe-footer">
          <div className="dotted-line"></div>
          <button
            onClick={submitIngredients}
            className="submit-button"
          >
            Save Ingredients
          </button>
        </div>
      </Card>
    </div>
  );
};

export default AddIngredient;
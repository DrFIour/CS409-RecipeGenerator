var secrets = require('../config/secrets');
const axios = require('axios');


async function get_recommended_meal(ingredients, previousMeals, comment) {
    const apiKey = secrets.gpt_api_key;
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    try {
        const prompt = `
        Given the ingredients and its portion: ${JSON.stringify(ingredients)}
        Recommend a meal that can be prepared with only these ingredients.
        The output ingredients should be a subset of the provided ingredients.
        You don't need to use all the ingredients. Just use as many as you need.
        Do not use any other ingredients than the provided ingredients (For example, if you don't see eggs in the provided ingredient, you must not use eggs for the meal).
        You should contain the amount of each ingredient in the ingredients part.
        You must provide detailed instructions on how to prepare the meal.

        You must strictly follow the preference/comments of the user if it's not empty: ${JSON.stringify(comment)}
        You must not recommend these meals again if the list is not empty: ${JSON.stringify(previousMeals)}
        
        The return should be in json format.
        Example format:
        {
            "meal": "Spaghetti Carbonara",
            "ingredients": ["spaghetti 400 grams", "bacon 3 pieces", "parmesan cheese 100 grams"],
            "instructions": "(Detailed instructions on how to prepare the meal)"
        }
        `;

        const response = await axios.post(apiUrl, {
            model: "gpt-3.5-turbo",
            messages: [{role: "user", content: prompt}]
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            }
        });

        const text = response.data.choices[0].message.content;
        return JSON.parse(text);
    } catch (error) {
        throw new Error("ChatGPT API not available");
    }
}

module.exports = {get_recommended_meal};

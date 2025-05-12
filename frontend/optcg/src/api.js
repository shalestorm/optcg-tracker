// src/api.js

const API_KEY = 'YOUR-API-KEY';  // Replace with your actual API key
const BASE_URL = 'https://apitcg.com/api/one-piece/cards';

export const getCards = async (name) => {
    try {
        const response = await fetch(`${BASE_URL}?name=${name}`, {
            method: 'GET',
            headers: {
                'x-api-key': API_KEY, // Add the API key to the header
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch cards');
        }

        const data = await response.json();
        return data;  // Return the data if the request was successful
    } catch (error) {
        console.error('Error fetching cards:', error);
        throw error;  // Rethrow the error to be handled where this function is called
    }
};

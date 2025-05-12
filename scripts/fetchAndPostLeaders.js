import fetch from 'node-fetch'; // Use import syntax for node-fetch
import fs from 'fs';

const API_KEY = '309bdba5bceba7e329a55fd78e5a94ca8e98805ad22c0c1953f60d2038b3e123';
const BASE_URL = 'https://apitcg.com/api/one-piece/cards?type=LEADER';
const LOCAL_API = 'http://localhost:8000/leaders/';

(async () => {
    try {
        const res = await fetch(BASE_URL, {
            headers: {
                'x-api-key': API_KEY,
            },
        });

        if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

        const data = await res.json();

        const leaders = data.data.map(card => ({
            name: card.name,
            set: card.set.name,
            image_url: card.images?.large || '',
        }));

        for (const leader of leaders) {
            const response = await fetch(LOCAL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leader),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.warn(`Failed to POST ${leader.name}: ${errorText}`);
            } else {
                console.log(`✅ Added: ${leader.name}`);
            }
        }
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
})();

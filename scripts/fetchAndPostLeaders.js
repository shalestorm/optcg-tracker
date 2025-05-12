const fetch = require('node-fetch');
const fs = require('fs');

// URL for the "local api"
const LOCAL_API = 'http://localhost:8000/leaders/';

// Read the JSON containing all leaders
fs.readFile('curated_leaders_cleaned.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('❌ Error reading the JSON file:', err.message);
        return;
    }

    try {
        const leaders = JSON.parse(data);
        let totalPosted = 0;

        for (const leader of leaders) {
            // Prepare the leader object
            const leaderData = {
                name: leader.name,
                set: leader.set,
                image_url: leader.image_url || '',
            };

            // double check if its already in the DB
            const existingRes = await fetch(`${LOCAL_API}?name=${encodeURIComponent(leaderData.name)}&set=${encodeURIComponent(leaderData.set)}`);
            const existingLeaders = await existingRes.json();

            const isLeaderExisting = existingLeaders.some(existingLeader => {
                return existingLeader.name.trim().toLowerCase() === leaderData.name.trim().toLowerCase() &&
                    existingLeader.set.trim().toLowerCase() === leaderData.set.trim().toLowerCase();
            });

            if (isLeaderExisting) {
                console.log(`Leader already exists: ${leaderData.name} (${leaderData.set})`);
                continue;
            }

            // Post the leaders themselves over to the DB to populate table data
            const postRes = await fetch(LOCAL_API, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leaderData),
            });

            if (!postRes.ok) {
                const errorText = await postRes.text();
                console.warn(`Failed to POST ${leaderData.name}: ${errorText}`);
            } else {
                console.log(`Added: ${leaderData.name} (${leaderData.set})`);
                totalPosted++;
            }
        }

        console.log(`Finished posting. Total leaders posted: ${totalPosted}`);
    } catch (err) {
        console.error('Error:', err.message);
    }
});

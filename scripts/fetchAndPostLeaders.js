const fetch = require('node-fetch');
const fs = require('fs'); s


//again just a cool easy way to push my json leaders file to my DB
// could not be bothered to make those queries lol
// not needed after the first run - but useful for building it up on a new machine
// ill leave it here



// URL for the "local api"
const LOCAL_API = 'http://localhost:8000/leaders/';

// Read the hard coded json to prep for posting to db
fs.readFile('curated_leaders_cleaned.json', 'utf8', async (err, data) => {
    if (err) {
        console.error('Error reading the JSON file:', err.message);
        return;
    }

    try {
        const leaders = JSON.parse(data);
        let totalPosted = 0;

        for (const leader of leaders) {
            // intializes the leader object
            const leaderData = {
                name: leader.name,
                set: leader.set,
                image_url: leader.image_url || '',
            };

            // check if entry is already in the DB
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

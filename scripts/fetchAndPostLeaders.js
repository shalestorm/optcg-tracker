const fetch = require('node-fetch');
const fs = require('fs');

const API_KEY = '309bdba5bceba7e329a55fd78e5a94ca8e98805ad22c0c1953f60d2038b3e123';
const BASE_URL = 'https://apitcg.com/api/one-piece/cards?type=LEADER';
const LOCAL_API = 'http://localhost:8000/leaders/';
const LIMIT = 100; // Max allowed by the API

(async () => {
    let page = 1;
    let totalFetched = 0;
    let keepFetching = true;

    try {
        while (keepFetching) {
            const url = `${BASE_URL}&limit=${LIMIT}&page=${page}`;
            console.log(`🔍 Fetching page ${page}: ${url}`);

            const res = await fetch(url, {
                headers: {
                    'x-api-key': API_KEY,
                },
            });

            if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);

            const data = await res.json();
            const leaders = data.data;

            if (!leaders || leaders.length === 0) {
                keepFetching = false;
                break;
            }

            totalFetched += leaders.length;

            for (const card of leaders) {
                const leader = {
                    name: card.name,
                    set: card.set.name,
                    image_url: card.images?.large || '',
                };

                const normalizedName = leader.name.trim().toLowerCase();
                const normalizedSet = leader.set.trim().toLowerCase();

                console.log(`Checking if leader exists: ${normalizedName} (${normalizedSet})`);

                const existingRes = await fetch(`${LOCAL_API}?name=${encodeURIComponent(leader.name)}&set=${encodeURIComponent(leader.set)}`);
                const existingLeaders = await existingRes.json();

                const isLeaderExisting = existingLeaders.some(existingLeader => {
                    const existingName = existingLeader.name.trim().toLowerCase();
                    const existingSet = existingLeader.set.trim().toLowerCase();
                    return existingName === normalizedName && existingSet === normalizedSet;
                });

                if (isLeaderExisting) {
                    console.log(`❌ Leader already exists: ${leader.name} (${leader.set})`);
                    continue;
                }

                const postRes = await fetch(LOCAL_API, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(leader),
                });

                if (!postRes.ok) {
                    const errorText = await postRes.text();
                    console.warn(`Failed to POST ${leader.name}: ${errorText}`);
                } else {
                    console.log(`✅ Added: ${leader.name} (${leader.set})`);
                }
            }

            if (leaders.length < LIMIT) {
                keepFetching = false; // Last page reached
            } else {
                page++;
            }
        }

        console.log(`🎉 Finished fetching. Total leaders processed: ${totalFetched}`);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
})();

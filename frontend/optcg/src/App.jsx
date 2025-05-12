import { useEffect, useState } from 'react';

function App() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8000/leaders/")
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch leaders");
        return res.json();
      })
      .then(data => setLeaders(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h1>One Piece TCG Leaders</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {leaders.map((leader) => (
          <div key={leader.id} style={{ margin: '10px', border: '1px solid #ccc', padding: '10px' }}>
            <img src={leader.image_url} alt={leader.name} width={150} height={200} />
            <h2>{leader.name}</h2>
            <p>Set: {leader.set}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

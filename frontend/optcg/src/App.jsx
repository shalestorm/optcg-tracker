import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import LeadersMenu from './pages/Leaders_menu.jsx'
import MatchLogs from './pages/Match_logs.jsx'

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaders" element={<LeadersMenu />} />
        <Route path="/matches" element={<MatchLogs />} />
      </Routes>
    </div>
  )
}

export default App

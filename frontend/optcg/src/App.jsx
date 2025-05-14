import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.jsx'
import LeadersMenu from './pages/Leaders_menu.jsx'
import MatchLogs from './pages/Match_logs.jsx'
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/leaders" element={<LeadersMenu />} />
        <Route path="/leaders/:leaderId/matches" element={<MatchLogs />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App

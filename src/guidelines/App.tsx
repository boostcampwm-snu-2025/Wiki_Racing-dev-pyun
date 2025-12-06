import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainMenuScreen from './MainMenuScreen';
import GamePlayScreen from './GamePlayScreen';
import LeaderboardScreen from './LeaderboardScreen';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<MainMenuScreen />} />
          <Route path="/play" element={<GamePlayScreen />} />
          <Route path="/leaderboard" element={<LeaderboardScreen />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
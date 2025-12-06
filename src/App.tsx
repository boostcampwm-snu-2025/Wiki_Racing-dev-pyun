import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { WikiRaceGame } from './components/WikiRaceGame';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<WikiRaceGame />} />
          <Route path="/play" element={<WikiRaceGame />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import SpacecraftList from './SpacecraftList'
import AstronautList from './AstronautList';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<SpacecraftList />} />
          <Route path="spacecrafts" element={<SpacecraftList />} />
          <Route path="spacecrafts/:id" element={<AstronautList />} />
          <Route path="spacecrafts/:id/astronauts" element={<AstronautList />} />
          <Route path="spacecrafts/:id/astronauts/:id" element={<AstronautList />} />
        </Routes>
      </BrowserRouter>

    </div>
  )
}

export default App
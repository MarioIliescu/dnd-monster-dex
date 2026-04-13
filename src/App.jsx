import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Monsters from "./Pages/Monsters.jsx";
import AboutMonsters from './Pages/AboutMonsters.jsx';
import './App.css'

function App() {


  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Monsters />} />
          <Route path="/AboutMonsters" element={<AboutMonsters />}/>
        </Routes>
      </BrowserRouter>

  )
}

export default App

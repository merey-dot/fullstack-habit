import {BrowserRouter,Routes,Route} from 'react-router-dom'

import Today from './pages/Today.tsx'
import './App.css'
function App() {


  return (
    <BrowserRouter>
            <Routes>
                <Route path="/" element={<Today />} />
                <Route path="/today" element={<Today />} />
                
            </Routes>
    </BrowserRouter>
  )
}

export default App

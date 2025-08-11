//Database connection and routing 
import { useEffect, useState } from 'react'
import { createClient } from "@supabase/supabase-js";
//import { supabase } from './utils/supabase'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import FareResult from './pages/fareResult';

// Initialize db client 
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// export const supabase = createClient(supabaseUrl, supabaseKey)

function App() {

  const [fares, setFares] = useState([]);

  useEffect(() => {
    const loadFares = async () => {
      const { data, error } = await supabase
        .from('fares')
        .select('*')
      if (!error) setFares(data)
    }
    loadFares()
  }, [])

  return (
      <div className="App">
        <header className="App-header">

          <h3 className="text-base font-mono underline">
            Hello Non-Nationals...
          </h3>

          <p className="text-red-500 "> Geo-tagging coming soon! </p>

          {/* <ul>
            {fares.map(f => (
              <li key={f.id}>
                {f.origin}  → {f.destination}: ${f.fare}</li>
            ))}
          </ul> */}

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fare" element={<FareResult />} />
          </Routes>

        </header>
      </div>
  );
}

export default App;

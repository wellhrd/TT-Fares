//Database connection and routing 
import { useState, useEffect } from 'react'
import { supabase } from './utils/supabase'

import { Routes, Route } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import FareResult from './pages/fareResult';

// Initialize db client 
//const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
// const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
// const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// export const supabase = createClient(supabaseUrl, supabaseKey)

function App() {

  const [instruments, setInstruments] = useState([]);
  useEffect(() => {
    getInstruments();
  }, []);
  async function getInstruments() {
     const { data, error } = await supabase.from("instruments").select();
  if (error) {
    console.error("Error fetching instruments:", error.message);
    setInstruments([]); // fallback to empty array
  } else {
    setInstruments(data ?? []); // prevent null being set
  }
  }

  return (
    <>
    <div className="App">
      <header className="App-header">
        
        {/* <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a> */}

        {/* <h3 className="text-base font-mono underline">
      Hello Non-Nationals, you gyals and fello fellers need help moving around Trinidad and Tobago? 
      We got you covered! Check out our fares below.
    </h3>

    <p className="text-red-500 ">
      Geo-tagging coming soon!
    </p> */}

    <Home />
    <br />
    <FareResult />


      </header>
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fare" element={<FareResult />} />
      </Routes> */}
    </div>

    <ul>
      {instruments.map((instrument) => (
        <li key={instrument.name}>{instrument.name}</li>
      ))}
    </ul>
    </>
  );
}

export default App;

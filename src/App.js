import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import FareResult from './pages/fareResult';
import AddFare from './pages/addFare';

function App() {

  return (
      <div className="App">
        <header className="App-header">

          <h3 className="text-base font-mono underline">
            Hello Non-Nationals...
          </h3>

          <p className="text-red-500 "> Geo-tagging coming soon! </p>
        {/* Navigation Menu */}
        <nav style={{ margin: '20px 0' }}>
          <Link 
            to="/" 
            style={{ 
              margin: '0 15px', 
              color: '#61dafb', 
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #61dafb'
            }}
          >
            Check Fares
          </Link>
          <Link 
            to="/add-fare" 
            style={{ 
              margin: '0 15px', 
              color: '#61dafb', 
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #61dafb'
            }}
          >
            Add Fare
          </Link>
        </nav>


          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/fare" element={<FareResult />} />
            <Route path="/add-fare" element={<AddFare />} />
          </Routes>

        </header>
      </div>
  );
}
export default App;
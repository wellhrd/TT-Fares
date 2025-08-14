import { BrowserRouter as Router, Routes, Route, Link, } from 'react-router-dom';
// import logo from './logo.svg';
import './App.css';
import Home from './pages/home';
import FareResult from './pages/fareResult';
import AddFare from './pages/addFare';
import About from './pages/about';


function App() {

  return (
    <>
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
            <Route path="/about" element={<About />} />
          </Routes>

     
 </header>

        <div className="my-footer">
              <Link 
            to="/about" 
            style={{ 
              margin: '0 15px', 
              color: '#66fb61ff', 
              textDecoration: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #fb617bff'
            }}
          >
            About Us
          </Link>

          <div className="copyright">
          <p>&copy; 2025 Walters Inc. All rights reserved.</p>
        </div>
      
        </div>
    
      </div>
      </>
  );
}
export default App;
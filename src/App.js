import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/home';
import FareResult from './pages/fareResult';
import AddFare from './pages/addFare';
import Footer from './pages/footer';
import About from './pages/about';
import VideoBG from './components/videoBG';

function App() {
  return (

    <>
      <div className="flex flex-col min-h-screen">

        {/* Main content area */}
        <header className="relative overflow-hidden bg-[#282c34] text-white flex flex-col items-center justify-center flex-1 text-[calc(10px+2vmin)] p-8 rounded-b-3xl">
          <VideoBG />

          <h3 className="relative z-10text-base font-mono underline">
            Hello Non-Nationals...
          </h3>

          {/* Link to about the project */}
          <Link
            to="/about"
            className="relative z-10 trinidad-flag-btn text-[#61dafb] border border-[#61dafb] rounded px-3 py-1 hover:bg-[#61dafb33] transition mb-4"
          >
            About TT Fares
          </Link>

          <p className="relative z-10 text-red-500 text-2xl">Geo-tagging coming soon!</p>

          {/* Navigation Menu */}
          <nav className="my-5 space-x-4">
            <Link
              to="/"
              className="relative z-10 text-[#61dafb] border border-[#61dafb] rounded px-3 py-1 hover:bg-[#61dafb33] transition"
            >
              Check Fares
            </Link>
            <Link
              to="/add-fare"
              className="relative z-10 text-[#61dafb] border border-[#61dafb] rounded px-3 py-1 hover:bg-[#61dafb33] transition"
            >
              Add Fare
            </Link>
          </nav>

          {/* Routes */}
          <div className="relative z-10 w-full">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fare" element={<FareResult />} />
              <Route path="/add-fare" element={<AddFare />} />
              <Route path="/footer" element={<Footer />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>

        </header>

        {/* Footer always at the bottom */}
        <Footer />
      </div>
    </>
  );
}

export default App;

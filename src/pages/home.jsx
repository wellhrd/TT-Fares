import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function Home() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [locations, setLocations] = useState([]);
  const [fareData, setFareData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        console.log("=== DEBUG INFO ===");
        console.log("Supabase URL:", process.env.REACT_APP_SUPABASE_URL);
        console.log("Supabase Key exists:", !!process.env.REACT_APP_SUPABASE_ANON_KEY);
        
        console.log("Fetching all fare data from database...");
        const { data, error } = await supabase
          .from("fares")
          .select("*");

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Error fetching fare data:", error.message);
          console.error("Error details:", error);
          console.log("Using fallback locations due to database error");
          // Fallback locations based on your database screenshot
          setLocations(["Port of Spain", "San Fernando", "Arima", "Curepe"]);
          setFareData([]); // Empty fare data, will need to fetch in FareResult
          setLoading(false);
          return;
        }

        if (!data || data.length === 0) {
          console.warn("No data found in fares table");
          console.log("Using fallback locations - no data returned");
          setLocations(["Port of Spain", "San Fernando", "Arima", "Curepe"]);
          setFareData([]);
          setLoading(false);
          return;
        }

        // Store the complete fare data
        setFareData(data);
        console.log("Fare data loaded:", data);

        // Extract unique locations from both origin and destination columns
        const uniqueLocations = new Set();
        data.forEach(fare => {
          if (fare.origin) uniqueLocations.add(fare.origin);
          if (fare.destination) uniqueLocations.add(fare.destination);
        });

        console.log("Unique locations found:", Array.from(uniqueLocations));

        // Convert Set to Array and sort alphabetically
        const sortedLocations = Array.from(uniqueLocations).sort();
        setLocations(sortedLocations);
        setLoading(false);
      } catch (err) {
        console.error("Unexpected error:", err);
        console.log("Using fallback locations due to unexpected error");
        setLocations(["Port of Spain", "San Fernando", "Arima", "Curepe"]);
        setFareData([]);
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);

  const handleSubmit = () => {
    if (!origin || !destination) {
      alert("Please select both origin and destination");
      return;
    }
    if (origin === destination) {
      alert("Origin and destination cannot be the same. Please select different locations.");
      return;
    }
    navigate(`/fare?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`);
  };

  const handleReset = () => {
    setOrigin("");
    setDestination("");
  };

  return (
    <div>
      
      <h1>🇹🇹 TTfares Calculator</h1>
     
      {/* Divider Component */}
      <div className="flex w-full flex-col lg:flex-row">
        <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center">
          From:
          <select 
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            disabled={loading}
            style={{ padding: '5px', minWidth: '150px' }}
          >
            <option value="">
              {loading ? "Loading locations..." : "Select origin"}
            </option>
            {locations.length > 0 ? (
              locations.filter(location => location !== destination).map((location, index) => (
                <option key={`origin-${index}`} value={location}>
                  {location}
                </option>
              ))
            ) : (
              !loading && <option disabled>No locations found</option>
            )}
          </select>
        </div>
        <div className="divider lg:divider-horizontal">
          or
        </div>
        <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center">
          TO:
          <select 
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={loading}
            style={{ padding: '5px', minWidth: '150px' }}
          >
            <option value="">
              {loading ? "Loading locations..." : "Select destination"}
            </option>
            {locations.length > 0 ? (
              locations.filter(location => location !== origin).map((location, index) => (
                <option key={`destination-${index}`} value={location}>
                  {location}
                </option>
              ))
            ) : (
              !loading && <option disabled>No locations found</option>
            )}
          </select>
        </div>
        {/* End of divider component */}
      </div>
      <br />
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button 
          type="button"
          onClick={handleSubmit}
          disabled={loading || !origin || !destination}
          className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Loading..." : "Check for Fare"}
        </button>
        
        <button 
          type="button"
          onClick={handleReset}
          disabled={loading}
          className="text-gray-700 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 shadow-lg shadow-gray-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

export default Home;
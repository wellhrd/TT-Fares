import React, { useState, useEffect } from 'react';
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);

function AddFare() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [fare, setFare] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from("fares")
        .select("origin, destination, fare");

      if (error) {
        console.error("Error fetching locations:", error);
        return;
      }

      // Extract unique locations
      const uniqueLocations = new Set();
      data?.forEach(fare => {
        if (fare.origin) uniqueLocations.add(fare.origin);
        if (fare.destination) uniqueLocations.add(fare.destination);
      });

      const sortedLocations = Array.from(uniqueLocations).sort();
      setLocations(sortedLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!origin || !destination || !fare) {
      setMessage("Please fill in all fields");
      return;
    }

    if (origin === destination) {
      setMessage("Origin and destination cannot be the same");
      return;
    }

    if (isNaN(fare) || parseFloat(fare) <= 0) {
      setMessage("Please enter a valid fare amount");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Check if route already exists
      const { data: existingData, error: checkError } = await supabase
        .from("fares")
        .select("*")
        .or(`and(origin.eq.${origin},destination.eq.${destination}),and(origin.eq.${destination},destination.eq.${origin})`);

      if (checkError) {
        throw checkError;
      }

      if (existingData && existingData.length > 0) {
        setMessage("This route already exists. Please update the existing fare instead.");
        setLoading(false);
        return;
      }

      // Insert new fare
      const { data, error } = await supabase
        .from("fares")
        .insert([
          {
            origin: origin,
            destination: destination,
            fare: parseFloat(fare)
          }
        ]);

      if (error) {
        throw error;
      }

      setMessage("Fare added successfully!");
      setOrigin("");
      setDestination("");
      setFare("");
      
      // Refresh locations list
      fetchLocations();

    } catch (error) {
      console.error("Error adding fare:", error);
      setMessage(`Error adding fare: ${error.message}`);
    }

    setLoading(false);
  };

  const handleReset = () => {
    setOrigin("");
    setDestination("");
    setFare("");
    setMessage("");
  };

  return (
    <div style={{ maxWidth: '500px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Fare</h2>
      
      {message && (
        <div style={{
          padding: '10px',
          marginBottom: '15px',
          borderRadius: '4px',
          backgroundColor: message.includes('success') ? '#d4edda' : '#f8d7da',
          color: message.includes('success') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('success') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Origin:
          </label>
          <select
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Select origin</option>
            {locations.filter(loc => loc !== destination).map((location, index) => (
              <option key={`origin-${index}`} value={location}>
                {location}
              </option>
            ))}
            <option value="__new__">+ Add new location</option>
          </select>
          
          {origin === "__new__" && (
            <input
              type="text"
              placeholder="Enter new origin location"
              value={origin === "__new__" ? "" : origin}
              onChange={(e) => setOrigin(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' }}
            />
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Destination:
          </label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          >
            <option value="">Select destination</option>
            {locations.filter(loc => loc !== origin).map((location, index) => (
              <option key={`destination-${index}`} value={location}>
                {location}
              </option>
            ))}
            <option value="__new__">+ Add new location</option>
          </select>
          
          {destination === "__new__" && (
            <input
              type="text"
              placeholder="Enter new destination location"
              value={destination === "__new__" ? "" : destination}
              onChange={(e) => setDestination(e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginTop: '5px' }}
            />
          )}
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Fare (TTD):
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={fare}
            onChange={(e) => setFare(e.target.value)}
            disabled={loading}
            placeholder="Enter fare amount"
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            type="submit"
            disabled={loading || !origin || !destination || !fare}
            className="text-white bg-gradient-to-r from-green-500 via-green-600 to-green-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 shadow-lg shadow-green-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Fare"}
          </button>
          
          <button 
            type="button"
            onClick={handleReset}
            disabled={loading}
            className="text-gray-700 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-300 shadow-lg shadow-gray-500/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddFare;
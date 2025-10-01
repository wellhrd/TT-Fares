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
  
  // Separate states for handling new location inputs
  const [showNewOrigin, setShowNewOrigin] = useState(false);
  const [showNewDestination, setShowNewDestination] = useState(false);
  const [newOriginText, setNewOriginText] = useState("");
  const [newDestinationText, setNewDestinationText] = useState("");

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

  const handleOriginChange = (e) => {
    const value = e.target.value;
    if (value === "__new__") {
      setShowNewOrigin(true);
      setOrigin("");
      setNewOriginText("");
    } else {
      setShowNewOrigin(false);
      setOrigin(value);
      setNewOriginText("");
    }
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    if (value === "__new__") {
      setShowNewDestination(true);
      setDestination("");
      setNewDestinationText("");
    } else {
      setShowNewDestination(false);
      setDestination(value);
      setNewDestinationText("");
    }
  };

  const handleNewOriginTextChange = (e) => {
    const value = e.target.value;
    setNewOriginText(value);
    setOrigin(value);
  };

  const handleNewDestinationTextChange = (e) => {
    const value = e.target.value;
    setNewDestinationText(value);
    setDestination(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const finalOrigin = showNewOrigin ? newOriginText.trim() : origin;
    const finalDestination = showNewDestination ? newDestinationText.trim() : destination;
    
    if (!finalOrigin || !finalDestination || !fare) {
      setMessage("Please fill in all fields");
      return;
    }

    if (finalOrigin === finalDestination) {
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
        .or(`and(origin.eq.${finalOrigin},destination.eq.${finalDestination}),and(origin.eq.${finalDestination},destination.eq.${finalOrigin})`);

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
            origin: finalOrigin,
            destination: finalDestination,
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
      setShowNewOrigin(false);
      setShowNewDestination(false);
      setNewOriginText("");
      setNewDestinationText("");
      
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
    setShowNewOrigin(false);
    setShowNewDestination(false);
    setNewOriginText("");
    setNewDestinationText("");
  };

  // Improved styles for better Edge browser compatibility
  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    color: '#333333',
    boxSizing: 'border-box'
  };

  const selectStyle = {
    ...inputStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    backgroundSize: '16px',
    paddingRight: '32px'
  };

  const optionStyle = {
    backgroundColor: '#ffffff',
    color: '#333333',
    padding: '4px'
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
          {!showNewOrigin ? (
            <select
              value={origin}
              onChange={handleOriginChange}
              disabled={loading}
              style={selectStyle}
            >
              <option value="" style={optionStyle}>Select origin</option>
              {locations.filter(loc => loc !== destination).map((location, index) => (
                <option key={`origin-${index}`} value={location} style={optionStyle}>
                  {location}
                </option>
              ))}
              <option value="__new__" style={optionStyle}>+ Add new location</option>
            </select>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter new origin location"
                value={newOriginText}
                onChange={handleNewOriginTextChange}
                disabled={loading}
                style={inputStyle}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowNewOrigin(false);
                  setOrigin("");
                  setNewOriginText("");
                }}
                disabled={loading}
                style={{
                  marginTop: '5px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  // color: 'blue'
                }}
              >
                Back to list
              </button>
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Destination:
          </label>
          {!showNewDestination ? (
            <select
              value={destination}
              onChange={handleDestinationChange}
              disabled={loading}
              style={selectStyle}
            >
              <option value="" style={optionStyle}>Select destination</option>
              {locations.filter(loc => loc !== origin).map((location, index) => (
                <option key={`destination-${index}`} value={location} style={optionStyle}>
                  {location}
                </option>
              ))}
              <option value="__new__" style={optionStyle}>+ Add new location</option>
            </select>
          ) : (
            <div>
              <input
                type="text"
                placeholder="Enter new destination location"
                value={newDestinationText}
                onChange={handleNewDestinationTextChange}
                disabled={loading}
                style={inputStyle}
                autoFocus
              />
              <button
                type="button"
                onClick={() => {
                  setShowNewDestination(false);
                  setDestination("");
                  setNewDestinationText("");
                }}
                disabled={loading}
                style={{
                  marginTop: '5px',
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Back to list
              </button>
            </div>
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
            style={inputStyle}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button 
            type="submit"
            disabled={loading || (!origin && !newOriginText) || (!destination && !newDestinationText) || !fare}
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
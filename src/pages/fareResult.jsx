import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { createClient } from "@supabase/supabase-js";

// Create Supabase client
const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY
);


function FareResult() {
  const query = new URLSearchParams(useLocation().search);
  const origin = query.get("origin");
  const destination = query.get("destination");

  const [fare, setFare] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFare = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("fares")
        .select("*");

      if (error) {
        console.error("Error fetching fares:", error.message);
        setFare("Error loading fare");
        setLoading(false);
        return;
      }

      // Try to find fare matching origin → destination or reversed
      const foundFare = data.find(f =>
        (f.origin === origin && f.destination === destination) ||
        (f.origin === destination && f.destination === origin)
      );

      setFare(foundFare ? foundFare.fare : "Fare not available");
      setLoading(false);
    };

    fetchFare();
  }, [origin, destination]);

  return (
    <div className="flex flex-col items-center justify-center p-4 shadow-lg shadow-white/5 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg">
      <h2>Fare from {origin} to {destination}</h2>

      {loading ? (
        <p className="text-gray-500">Loading fare...</p>
      ) : (
        <div className="flex items-center text-[45px] text-black text-green-500">
          {fare === "Fare not available" || typeof fare === "string" ? (
            <p className="text-red-500 text-xl font-semibold">{fare}</p>
          ) : (
            <>
              <CurrencyDollarIcon className="w-5 h-5 mr-1" />
              <span>{fare}</span>.00
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default FareResult;

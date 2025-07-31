import React, { useState } from 'react';
import Button from '@mui/material/Button';

import ReactDOM from 'react-dom/client';
import { useNavigate } from "react-router-dom";
//import FareResult from './fareResult';

function Home() {
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");

    const navigate = useNavigate();
    const handleSubmit = () => {
        navigate(`/fare?origin=${origin}&destination=${destination}`);
    };
    return (
        <div>
            <h1>TTfares</h1>

            {/* Divider Component */}
            <div className="flex w-full flex-col lg:flex-row">

                <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center">
                    From:

                    <select onChange={(e) => setOrigin(e.target.value)}>
                        <option>Select origin</option>
                        <option>Port of Spain</option>
                        <option>San Fernando</option>
                        <option> Curepe</option>
                    </select>
                </div>

                <div className="divider lg:divider-horizontal">
                    or
                </div>

                <div className="card bg-base-300 rounded-box grid h-32 grow place-items-center"> 
                    TO:

                    <select onChange={(e) => setDestination(e.target.value)}>
                        <option>Select destination</option>
                        <option>San Fernando</option>
                        <option>Arima</option>
                        <option>Port of Spain </option>
                    </select>
                </div>

                {/* End of divider component */}
            </div> 


            <br />

            <button type="button"
                onClick={handleSubmit}
                class="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">
                Check for Fare </button>

            {/* <button onClick={handleSubmit}>Check Fare</button> */}
        </div>
    );
}
export default Home;
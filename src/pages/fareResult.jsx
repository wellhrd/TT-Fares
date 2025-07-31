import { useLocation } from "react-router-dom";
import { getFare } from "../data/fareUtils";
import { CurrencyDollarIcon } from '@heroicons/react/24/solid';


function FareResult() {
    const query = new URLSearchParams(useLocation().search);
    const origin = query.get("origin");
    const destination = query.get("destination");
    const fare = getFare(origin, destination);
    return (
        <>
        <div>
            <h2>Fare from {origin} to {destination}</h2>
            <p className="text-[18px] text-black">{fare === "Fare not available" ? fare : `$${fare}.01`}</p>
        </div>

        <div className="flex items-center text-[45px] text-black text-green-500">
  {fare === "Fare not available" ? (
    <p>{fare}</p>
  ) : (
    <>
      <CurrencyDollarIcon className="w-5 h-5 mr-1  " />
      <span>{fare}</span>.00
    </>
  )}
</div>
</>
    );
}
export default FareResult;
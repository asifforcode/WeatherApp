import { useEffect, useState } from "react";

const TemperatureDisplay = ({ temperature }) => {
  const [dashArray, setDashArray] = useState("0 100");
  const [color, setColor] = useState("#FF6347");
  const [tempLabel, setTempLabel] = useState("");

  useEffect(() => {
    const maxTemp = 45;
    const percentage = (temperature / maxTemp) * 100;

    // Adjusting the dasharray for the gauge
    const filledLength = percentage;
    const remainingLength = 100 - filledLength;

    setDashArray(`${filledLength} ${remainingLength}`);

    if (temperature < 8) {
      setColor("#1E90FF");
      setTempLabel("Very Low");
    } else if (temperature < 18) {
      setColor("#4682B4");
      setTempLabel("Low");
    } else if (temperature < 28) {
      setColor("#FFD700");
      setTempLabel("Medium");
    } else if (temperature < 38) {
      setColor("#FFA500");
      setTempLabel("High");
    } else {
      setColor("#FF6347");
      setTempLabel("Very High");
    }
  }, [temperature]);

  return (
    <div className="relative size-40">
      <svg className="rotate-[135deg] size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-current text-gray-200"
          strokeWidth="1"
          strokeDasharray="100 100" // Full circle background
          strokeLinecap="round"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className={`stroke-current`}
          stroke={color}
          strokeWidth="2"
          strokeDasharray={dashArray}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <span className={`text-2xl font-bold`} style={{color: color}}>
          Temp {temperature}
        </span>
        <span style={{color: color}} className="block">°C</span>
        <span style={{color: color}} className="text-xs block">{tempLabel}</span>
      </div>
    </div>
  );
};


export default TemperatureDisplay;
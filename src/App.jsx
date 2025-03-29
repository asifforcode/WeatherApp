import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { ApiContext } from "./contexts/ApiContext";
import humidity from "./assets/image.png";
import wind from "./assets/wind.jpg";
import NotFound from "./components/NotFound";

const WeatherApp = () => {
  const {
    weather,
    forecast,
    loading,
    error,
    city,
    setCity,
    setSuggestions,
    history,
    fetchWeather,
    setTheme,
    suggestions,
    fetchSuggestions,
    theme,
  } = useContext(ApiContext);

  const switchTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const suggestionsContainer = useRef(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const API_KEY = import.meta.env.VITE_API_KEY;
          const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
          try {
            const response = await axios.get(weatherUrl);
            setCity(response.data.name);
            fetchWeather();
          } catch (err) {
            console.error("Failed to fetch weather data:", err);
          }
        },
        (err) => {
          console.error("Unable to retrieve location:", err);
        }
      );
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (suggestionsContainer.current && !suggestionsContainer.current.contains(event.target)) {
        setSuggestions([]);
      }
    };
    if (suggestions.length > 0) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [suggestions, setSuggestions]);

  const selectFromHistory = (selectedCity) => {
    setCity(selectedCity);
    fetchWeather();
  };

  return (
    <div
      className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
        theme === "dark"
          ? "bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white"
          : "bg-gradient-to-br from-gray-50 via-blue-50 to-teal-50 text-gray-800"
      }`}
    >
      <button
        onClick={switchTheme}
        className={`fixed top-4 right-4 z-10 p-2 rounded-full bg-opacity-80 backdrop-blur-md shadow-lg hover:scale-105 transition-transform ${
          theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-gray-800"
        }`}
      >
        {theme === "dark" ? "☀️" : "🌙"}
      </button>

      <h1
        className={`text-4xl md:text-6xl font-extrabold text-center mb-10 tracking-wide bg-clip-text text-transparent ${
          theme === "dark"
            ? "bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            : "bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-600"
        } drop-shadow-lg animate-pulse`}
      >
        Weather Report
      </h1>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          fetchWeather();
        }}
        className="relative max-w-xl mx-auto mb-10"
      >
        <div className="relative flex items-center w-full">
          <svg
            className={`absolute left-4 w-5 h-5 ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search for a city..."
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              fetchSuggestions(e.target.value);
            }}
            className={`w-full pl-12 pr-24 py-4 rounded-full shadow-lg focus:ring-4 outline-none transition-all duration-300 border ${
              theme === "dark"
                ? "bg-gray-800 text-white placeholder-gray-500 border-gray-700 focus:ring-blue-600"
                : "bg-white text-gray-800 placeholder-gray-400 border-gray-200 focus:ring-teal-300"
            }`}
          />
          <button
            type="submit"
            className={`absolute right-2 px-5 py-2 rounded-full font-medium shadow-md transition-all duration-300 ${
              theme === "dark"
                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
                : "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
            }`}
          >
            Search
          </button>
        </div>
        {suggestions.length > 0 && (
          <ul
            ref={suggestionsContainer}
            className={`absolute w-full mt-2 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-20 border ${
              theme === "dark"
                ? "bg-gray-800 text-white border-gray-700"
                : "bg-white text-gray-800 border-gray-200"
            }`}
          >
            {suggestions.map((option, idx) => (
              <li
                key={idx}
                className={`px-4 py-3 cursor-pointer transition-colors duration-200 flex items-center gap-2 ${
                  theme === "dark" ? "hover:bg-gray-700" : "hover:bg-teal-50"
                }`}
                onClick={() => {
                  setCity(option);
                  setSuggestions([]);
                }}
              >
                <svg
                  className={`w-4 h-4 ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                {option}
              </li>
            ))}
          </ul>
        )}
      </form>

      {history.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {history.map((entry, idx) => (
            <button
              key={idx}
              onClick={() => selectFromHistory(entry)}
              className={`px-4 py-2 rounded-full shadow-md transition-colors ${
                theme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {entry}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <motion.p
          className="text-center mt-8"
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <img
            className="w-16 h-16 mx-auto animate-spin"
            src="https://www.svgrepo.com/show/474682/loading.svg"
            alt="Loading spinner"
          />
        </motion.p>
      )}

      {error && (
        <div className="text-center mt-8">
          <NotFound />
          <p className="mt-4 text-red-500 font-medium">{error}</p>
        </div>
      )}

      {weather && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mt-8 relative"
        >
          <div className="absolute -z-10 inset-0 overflow-hidden">
            <div
              className={`absolute -top-20 -left-20 w-64 h-64 rounded-full ${
                theme === "dark" ? "bg-blue-600" : "bg-teal-400"
              } opacity-20 blur-3xl`}
            ></div>
            <div
              className={`absolute -bottom-20 -right-20 w-64 h-64 rounded-full ${
                theme === "dark" ? "bg-purple-600" : "bg-blue-400"
              } opacity-20 blur-3xl`}
            ></div>
          </div>

          <div
            className={`relative rounded-3xl overflow-hidden backdrop-blur-lg shadow-2xl border ${
              theme === "dark"
                ? "bg-gray-900/40 border-gray-700/50"
                : "bg-white/40 border-white/50"
            }`}
          >
            <div className="absolute top-0 left-0 right-0 h-24 overflow-hidden">
              <svg
                className={`absolute bottom-0 w-full h-16 ${
                  theme === "dark" ? "text-blue-500/10" : "text-teal-500/10"
                }`}
                viewBox="0 0 1200 120"
                preserveAspectRatio="none"
              >
                <path
                  d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                  fill="currentColor"
                ></path>
              </svg>
            </div>

            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 text-center md:text-left mb-8 md:mb-0">
                <div className="flex items-center justify-center md:justify-start mb-4">
                  <h2
                    className={`text-4xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {weather.name}
                  </h2>
                  <div
                    className={`ml-4 px-3 py-1 rounded-full text-xs font-semibold ${
                      theme === "dark"
                        ? "bg-indigo-900/50 text-indigo-200"
                        : "bg-teal-100 text-teal-800"
                    }`}
                  >
                    Now
                  </div>
                </div>

                <p
                  className={`text-lg capitalize mb-6 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {weather.weather[0].description}
                </p>

                <div className="flex items-end justify-center md:justify-start">
                  <div
                    className={`text-7xl font-extrabold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {Math.round(weather.main.temp)}
                  </div>
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      theme === "dark" ? "text-blue-300" : "text-teal-600"
                    }`}
                  >
                    °C
                  </div>
                </div>

                <div
                  className={`mt-6 inline-flex items-center px-4 py-2 rounded-full ${
                    theme === "dark"
                      ? "bg-gray-800/50 text-gray-300"
                      : "bg-gray-100/70 text-gray-700"
                  }`}
                >
                  <span>Feels like {Math.round(weather.main.feels_like)}°C</span>
                </div>
              </div>

              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div
                  className={`p-6 rounded-full mb-6 ${
                    theme === "dark" ? "bg-gray-800/30" : "bg-white/30"
                  }`}
                >
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                    alt={weather.weather[0].description}
                    className="w-32 h-32 drop-shadow-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <img
                      className="w-8"
                      src={humidity || "/placeholder.svg"}
                      alt="Humidity icon"
                    />
                    <div>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Humidity
                      </p>
                      <p className="text-lg font-semibold">{weather.main.humidity}%</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <img className="w-8" src={wind || "/placeholder.svg"} alt="Wind icon" />
                    <div>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Wind Speed
                      </p>
                      <p className="text-lg font-semibold">{weather.wind.speed} km/h</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white Documents/50"
                    }`}
                  >
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3V21M12 3L7 8M12 3L17 8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Pressure
                      </p>
                      <p className="text-lg font-semibold">{weather.main.pressure} hPa</p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-3 p-4 rounded-xl ${
                      theme === "dark" ? "bg-gray-800/50" : "bg-white/50"
                    }`}
                  >
                    <svg
                      className="w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3V5M12 19V21M5 12H3M21 12H19M18.364 5.636L16.95 7.05M7.05 16.95L5.636 18.364M7.05 7.05L5.636 5.636M18.364 18.364L16.95 16.95"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div>
                      <p
                        className={`text-xs ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Visibility
                      </p>
                      <p className="text-lg font-semibold">
                        {(weather.visibility / 1000).toFixed(1)} km
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 flex justify-center">
              <button
                onClick={() => fetchWeather()}
                className={`px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white hover:from-blue-700 hover:to-indigo-800"
                    : "bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600"
                }`}
              >
                Refresh
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {forecast && (
        <div className="max-w-4xl mx-auto mt-10">
          <h3
            className={`text-2xl font-bold text-center mb-6 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            5-Day Forecast
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {forecast.slice(0, 5).map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`p-4 rounded-2xl backdrop-blur-sm ${
                  theme === "dark"
                    ? "bg-gray-800/40 border border-gray-700/50"
                    : "bg-white/40 border border-white/50"
                } shadow-lg`}
              >
                <div className="flex flex-col items-center">
                  <p
                    className={`text-sm font-medium mb-2 ${
                      theme === "dark" ? "text-gray-300" : "text-gray-700"
                    }`}
                  >
                    {new Date(day.dt_txt).toLocaleDateString("en-US", { weekday: "short" })}
                  </p>

                  <div
                    className={`w-16 h-16 flex items-center justify-center rounded-full mb-2 ${
                      theme === "dark" ? "bg-gray-700/50" : "bg-gray-100/50"
                    }`}
                  >
                    <img
                      src={`https://openweathermap.org/img/wn/${day.weather[0].icon}.png`}
                      alt={day.weather[0].description}
                      className="w-12 h-12"
                    />
                  </div>

                  <p
                    className={`text-xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-800"
                    }`}
                  >
                    {Math.round(day.main.temp)}°C
                  </p>

                  <p
                    className={`text-xs mt-2 capitalize ${
                      theme === "dark" ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {day.weather[0].description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherApp;
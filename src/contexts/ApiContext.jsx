import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ApiContext = createContext();

const API_KEY = import.meta.env.VITE_API_KEY;

export const ApiProvider = ({ children }) => {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState("light");
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const fetchWeather = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      await fetchForecast(city);
      updateHistory(city);
    } catch (err) {
      setWeather(null);
      setError("City not found or API error");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );

      // Select one forecast per day (12:00 PM entries)
      const dailyForecast = response.data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
      ).slice(0, 5);

      setForecast(dailyForecast);
    } catch (err) {
      console.error("Forecast fetch error:", err);
      setForecast(null);
    }
  };

  const fetchSuggestions = async (input) => {
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=3&appid=${API_KEY}`
      );
      setSuggestions(response.data.map((location) => location.name));
    } catch (err) {
      console.error("Suggestion fetch error:", err);
    }
  };

  const updateHistory = (city) => {
    const newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
  };

  return (
    <ApiContext.Provider
      value={{
        weather,
        forecast,
        city,
        setCity,
        suggestions,
        setSuggestions,
        loading,
        error,
        theme,
        setTheme,
        history,
        fetchWeather,
        fetchSuggestions,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

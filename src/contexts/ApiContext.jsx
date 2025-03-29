
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

  const API_KEY = import.meta.env.VITE_API_KEY;


  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    setHistory(storedHistory);
  }, []);

  const fetchWeather = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    if (!city) return;
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
      fetchForecast(city);
      updateHistory(city);
    } catch (err) {
      setWeather(null);
      setError("City not found or API error");
    }
    setLoading(false);
  };

  const fetchForecast = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
      );
      setForecast(response.data.list.slice(0, 5));
    } catch (err) {
      console.error("Forecast error", err);
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
      setSuggestions(response.data.map((city) => city.name));
    } catch (err) {
      console.error("Suggestion error", err);
    }
  };

  const updateHistory = (city) => {
    let newHistory = [city, ...history.filter((c) => c !== city)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem("weatherHistory", JSON.stringify(newHistory));
  };


  return (
    <ApiContext.Provider value={{ weather, setTheme,setSuggestions,forecast,setCity,city, loading,theme, error, history, fetchWeather, suggestions, fetchSuggestions }}>
      {children}
    </ApiContext.Provider>
  );
};
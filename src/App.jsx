import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import './index.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false); // Changed to false initially
  const [error, setError] = useState(null);
  const [city, setCity] = useState('London'); // Default city
  const [inputValue, setInputValue] = useState(''); // For controlled input

  // API key (replace with your own if needed)
  const apiKey = 'dbfc9157cf604abb90e35149251803';

  // Function to fetch weather data
  const fetchWeather = async (cityName) => {
    const apiUrl = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${cityName}&aqi=yes`;
    setLoading(true);
    setError(null); // Reset error before fetching
    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data);
      setCity(cityName); // Update city state after successful fetch
    } catch (err) {
      setError('City not found or API error occurred');
      setWeatherData(null); // Clear previous data on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather for default city (London) on mount
  useEffect(() => {
    fetchWeather(city);
  }, []); // Runs once on mount with default city

  // Handle form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      fetchWeather(inputValue.trim()); // Fetch weather for entered city
    }
  };

  return (
    <div className="App">
      <h1>Weather App</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter city name"
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {weatherData && !loading && (
        <div className="weather-info">
          <h2>Weather in {weatherData.location.name}</h2>
          <p><strong>Country:</strong> {weatherData.location.country}</p>
          <p><strong>Temperature:</strong> {weatherData.current.temp_c}°C / {weatherData.current.temp_f}°F</p>
          <p><strong>Condition:</strong> {weatherData.current.condition.text}</p>
          <img src={weatherData.current.condition.icon} alt="Weather icon" />
          <p><strong>Humidity:</strong> {weatherData.current.humidity}%</p>
          <p><strong>Wind:</strong> {weatherData.current.wind_kph} kph ({weatherData.current.wind_dir})</p>
          <p><strong>Air Quality (CO):</strong> {weatherData.current.air_quality.co} µg/m³</p>
        </div>
      )}
      {loading && <div>Loading...</div>}
    </div>
  );
}

export default App;
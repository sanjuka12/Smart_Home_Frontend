import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [weatherData, setWeatherData] = useState(null);
  const API_KEY = '584ee5b28fe5ab4f3356cfe17f72d1ba';
  const CITY = 'Galle';
  const COUNTRY_CODE = 'LK';

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, []);

  if (!weatherData || weatherData.cod !== 200) {
    return <div>Loading weather data...</div>;
  }

  const { main, weather, wind, sys, name } = weatherData;

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: 'auto', background: '#f3f3f3', borderRadius: '10px' }}>
      <h2>Weather in {name}, {sys.country}</h2>
      <p><strong>Temperature:</strong> {main.temp} °C</p>
      <p><strong>Feels Like:</strong> {main.feels_like} °C</p>
      <p><strong>Humidity:</strong> {main.humidity} %</p>
      <p><strong>Pressure:</strong> {main.pressure} hPa</p>
      <p><strong>Weather:</strong> {weather[0].main} ({weather[0].description})</p>
      <p><strong>Wind Speed:</strong> {wind.speed} m/s</p>
      <p><strong>Wind Direction:</strong> {wind.deg}°</p>
    </div>
  );
};

export default Weather;

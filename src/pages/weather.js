import React, { useEffect, useState } from 'react';

const Weather = () => {
  const [forecastData, setForecastData] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);
  const API_KEY = '584ee5b28fe5ab4f3356cfe17f72d1ba';
  const CITY = 'Galle';
  const COUNTRY_CODE = 'LK';

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`
        );
        const data = await response.json();

        if (data.cod === "200") {
          setCityInfo(data.city);
          setForecastData(data.list);  // array of 3-hour forecast data points
        } else {
          console.error("Error fetching forecast:", data.message);
        }
      } catch (error) {
        console.error('Error fetching forecast data:', error);
      }
    };

    fetchForecast();
  }, []);

  if (!forecastData.length || !cityInfo) {
    return <div>Loading forecast data...</div>;
  }

  // Group forecast data by date (day)
  const groupedByDate = forecastData.reduce((acc, entry) => {
    const date = entry.dt_txt.split(' ')[0]; // get YYYY-MM-DD part
    if (!acc[date]) acc[date] = [];
    acc[date].push(entry);
    return acc;
  }, {});

  // For each day, take the average temp, weather description from first 3h entry, etc.
  const dailySummaries = Object.entries(groupedByDate).map(([date, entries]) => {
    const avgTemp = entries.reduce((sum, e) => sum + e.main.temp, 0) / entries.length;
    const weatherMain = entries[0].weather[0].main;
    const weatherDesc = entries[0].weather[0].description;
    return { date, avgTemp, weatherMain, weatherDesc };
  });

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', background: '#f3f3f3', borderRadius: '10px' }}>
      <h2>5-Day Weather Forecast for {cityInfo.name}, {cityInfo.country}</h2>
      {dailySummaries.map(({ date, avgTemp, weatherMain, weatherDesc }) => (
        <div key={date} style={{ marginBottom: '15px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
          <h3>{date}</h3>
          <p><strong>Average Temperature:</strong> {avgTemp.toFixed(1)} °C</p>
          <p><strong>Weather:</strong> {weatherMain} ({weatherDesc})</p>
        </div>
      ))}
    </div>
  );
};

export default Weather;

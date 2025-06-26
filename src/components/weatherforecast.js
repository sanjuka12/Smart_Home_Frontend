import React, { useEffect, useState } from 'react';
import './weatherforecast.css';

// Helper: map weather main conditions to icons (use OpenWeather icons or emoji fallback)
const weatherIcons = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Smoke: '💨',
  Haze: '🌫️',
  Dust: '🌪️',
  Fog: '🌫️',
  Sand: '🌪️',
  Ash: '🌋',
  Squall: '💨',
  Tornado: '🌪️',
};

const WeatherForecast = ({ small }) => {
  const [dailySummaries, setDailySummaries] = useState([]);
  const [cityInfo, setCityInfo] = useState(null);

  const API_KEY = '584ee5b28fe5ab4f3356cfe17f72d1ba';
  const CITY = 'Galle';
  const COUNTRY_CODE = 'LK';

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${CITY},${COUNTRY_CODE}&appid=${API_KEY}&units=metric`
        );
        const data = await res.json();

        if (data.cod === "200") {
          setCityInfo(data.city);

          // Group by date
          const grouped = data.list.reduce((acc, entry) => {
            const date = entry.dt_txt.split(' ')[0];
            if (!acc[date]) acc[date] = [];
            acc[date].push(entry);
            return acc;
          }, {});

          // Summarize per day
          const summaries = Object.entries(grouped).map(([date, entries]) => {
            const avgTemp = entries.reduce((sum, e) => sum + e.main.temp, 0) / entries.length;
            const weatherMain = entries[0].weather[0].main;
            const weatherDesc = entries[0].weather[0].description;
            // Sum rain volume (3h total)
            const rainVolume = entries.reduce((sum, e) => sum + (e.rain?.['3h'] || 0), 0);
            return { date, avgTemp, weatherMain, weatherDesc, rainVolume };
          });

          setDailySummaries(summaries.slice(0, 5)); // only next 5 days
        } else {
          console.error('Error fetching weather:', data.message);
        }
      } catch (err) {
        console.error('Error fetching forecast data:', err);
      }
    };

    fetchForecast();
  }, []);

  // Format date as "Mon, 20 Jun"
  const formatDate = (dateStr) => {
    const options = { weekday: 'short', day: 'numeric', month: 'short' };
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, options);
  };

  return (
   <div className={`forecast-container ${small ? 'small' : ''}`}>
      <h2>Upcoming Weather Forecast for {cityInfo?.name}, {cityInfo?.country}</h2>
      <div className="forecast-bar">
        {dailySummaries.length === 0 && <p>Loading forecast...</p>}
        {dailySummaries.map(({ date, avgTemp, weatherMain, weatherDesc, rainVolume }) => (
          <div key={date} className="forecast-day">
            <div className="date">{formatDate(date)}</div>
            <div className="icon" title={weatherDesc}>
              {weatherIcons[weatherMain] || '❓'}
            </div>
            <div className="temp">{avgTemp.toFixed(1)}°C</div>
            {rainVolume > 0 ? (
              <div className="rain" title={`${rainVolume.toFixed(1)} mm rain`}>
                🌧️ {rainVolume.toFixed(1)} mm
              </div>
            ) : (
              <div className="rain no-rain" title="No rain expected">☀️ No Rain</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;

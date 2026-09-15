import { useState } from "react";
import SearchBar, { type WeatherData } from "./components/SearchBar.tsx";

function interpretWeatherCodes(code: number): string {
  if (code === 0) return "Clear sky";
  if ([1, 2, 3].includes(code)) return "Partly cloudy";
  if ([45, 48].includes(code)) return "Foggy";
  if ([51, 53, 55, 61, 63, 65].includes(code)) return "Rainy";
  if ([71, 73, 75].includes(code)) return "Snowy";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";
  return "Unknown";
}

export default function App() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>Weather Dashboard</h1>

      <SearchBar
        setError={setError}
        setWeatherData={setWeatherData}
        setLoading={setLoading}
      />

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {weatherData && !loading && (
        <div style={{ marginTop: "1rem" }}>
          <h2>{weatherData.locationName}</h2>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Wind speed: {weatherData.windspeed} km/h</p>
          <p>Condition: {interpretWeatherCodes(weatherData.weathercode)}</p>
        </div>
      )}
    </div>
  );
}

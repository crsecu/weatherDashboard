import { useState } from "react";

export interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  locationName: string;
}

export interface SearchBarProps {
  setError: (error: string) => void;
  setWeatherData: (weatherData: WeatherData | null) => void;
  setLoading: (loading: boolean) => void;
}

export default function SearchBar({
  setError,
  setWeatherData,
  setLoading
}: SearchBarProps) {
  const [location, setLocation] = useState("");

  async function getWeather() {
    if (!location.trim()) {
      setError("Please enter a city name.");
      return;
    }

    const coordsURL = "https://geocoding-api.open-meteo.com/v1/search";
    const weatherURL = "https://api.open-meteo.com/v1/forecast";

    setError("");
    setLoading(true);

    try {
      const res = await fetch(
        `${coordsURL}?name=${encodeURIComponent(location)}&count=1`
      );

      if (!res.ok) {
        setError("Some error occurred while fetching coordinates.");
        return;
      }

      const coords = await res.json();

      if (!coords.results || coords.results.length === 0) {
        setError(`No location found for "${location}".`);
        return;
      }

      const { latitude, longitude, name } = coords.results[0];

      const response = await fetch(
        `${weatherURL}?latitude=${latitude}&longitude=${longitude}&current_weather=true&temperature_unit=celsius`
      );

      if (!response.ok) {
        setError("Some error occurred while fetching weather data.");
        return;
      }

      const data = await response.json();

      setWeatherData({
        temperature: data.current_weather.temperature,
        windspeed: data.current_weather.windspeed,
        weathercode: data.current_weather.weathercode,
        locationName: name
      });
    } catch (err) {
      console.error("ERROR...: ", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <input
        type="search"
        value={location}
        placeholder="Enter a city"
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && getWeather()}
      />
      <button type="button" onClick={getWeather}>
        Go
      </button>
    </>
  );
}

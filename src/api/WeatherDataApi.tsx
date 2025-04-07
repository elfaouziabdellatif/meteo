const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
import axios from "axios";

export const fetchWeatherData = async (
  param: { city: string } | { lat: number; lon: number },
  type: "today" | "three_hourly" | "hourly" | "daily" = "today",
  days?: number // Optional, only used for daily forecasts
) => {
  try {
    let url = "";

    if ("city" in param) {
      // City-based requests
      switch (type) {
        case "today":
          url = `https://api.openweathermap.org/data/2.5/weather?q=${param.city}&appid=${API_KEY}&units=metric`;
          break;
        case "three_hourly":
          url = `https://api.openweathermap.org/data/2.5/forecast?q=${param.city}&appid=${API_KEY}&units=metric`;
          break;
        case "hourly":
          url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?q=${param.city}&appid=${API_KEY}&units=metric`;
          break;
        case "daily":
          const cnt = days ? Math.min(days, 16) : 7; // Default to 7 days, max 16
          url = `https://pro.openweathermap.org/data/2.5/forecast/daily?q=${param.city}&cnt=${cnt}&appid=${API_KEY}&units=metric`;
          break;
        default:
          throw new Error("Invalid forecast type for city-based request.");
      }
    } else if ("lat" in param && "lon" in param) {
      // Lat/Lon-based requests
      switch (type) {
        case "today":
          url = `https://api.openweathermap.org/data/2.5/weather?lat=${param.lat}&lon=${param.lon}&appid=${API_KEY}&units=metric`;
          break;
        case "three_hourly":
          url = `https://api.openweathermap.org/data/2.5/forecast?lat=${param.lat}&lon=${param.lon}&appid=${API_KEY}&units=metric`;
          break;
        case "hourly":
          url = `https://pro.openweathermap.org/data/2.5/forecast/hourly?lat=${param.lat}&lon=${param.lon}&appid=${API_KEY}&units=metric`;
          break;
        case "daily":
          const cnt = days ? Math.min(days, 16) : 7;
          url = `https://pro.openweathermap.org/data/2.5/forecast/daily?lat=${param.lat}&lon=${param.lon}&cnt=${cnt}&appid=${API_KEY}&units=metric`;
          break;
        default:
          throw new Error("Invalid forecast type for lat/lon-based request.");
      }
    }

    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
};

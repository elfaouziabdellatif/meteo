import HeroSection from "../components/heroSection";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import WeatherForecast from "../components/WeatherForecast";
import InteractiveWeatherMap from "../components/WeatherMap";
import Footer from "../components/Foooter";
import { fetchWeatherData } from "../api/WeatherDataApi";


interface weatherData {
    city: string;
    country: string;
    temperature: string;
    condition: string;
    windSpeed: string;
    humidity: string;
    feelsLike: string;
    icon: string;
    }

const HomePage = () => {
  const [searchCity, setSearchCity] = useState("rabat");
  const [pickedPlace, setPickedPlace] = useState<L.LatLng | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [temperatureUnit, setTemperatureUnit] = useState("c");
  const [weatherData, setWeatherData] = useState({
    city: "",
    country: "",
    temperature: "",
    condition: "",
    windSpeed: "",
    humidity: "",
    feelsLike: "",
    icon: "",
  });

  // Store forecast data
  const [forecastData, setForecastData] = useState<any[]>([]);

  useEffect(() => {
    const fetchForecast = async () => {
        setLoading(true);
      try {
        let data;
        let hourlyData
        if (pickedPlace) {
            data = await fetchWeatherData({ lat: pickedPlace.lat, lon: pickedPlace.lng }, "daily",16);
            hourlyData = await fetchWeatherData({ lat: pickedPlace.lat, lon: pickedPlace.lng }, "three_hourly");
        } else if (searchCity) {
            data = await fetchWeatherData({ city: searchCity }, "daily",16);
            hourlyData = await fetchWeatherData({ city: searchCity }, "three_hourly");
        } else if (!searchCity && !pickedPlace && weatherData.city) {
            data = await fetchWeatherData({ city: weatherData.city }, "daily",16);
            hourlyData = await fetchWeatherData({ city: weatherData.city }, "three_hourly");

        }else {
          return
        }
        
        
        const timezoneOffset = data.city.timezone; // Timezone offset in seconds
  
        // Get current UTC time and adjust with the city's timezone offset
        const currentUtcTime = Date.now();
        const localTime = new Date(currentUtcTime + timezoneOffset * 1000); // Convert offset to milliseconds
  
        const currentHour = localTime.getUTCHours(); // Get the hour of the local time
        const isDayTime = currentHour >= 6 && currentHour < 18;
        const isEvening = currentHour >= 18 && currentHour < 20;
        const isNightTime = currentHour >= 20 || currentHour < 6;
  
        // Choose temperature & feels like based on time of day
        const temperature = isDayTime
          ? data.list[0].temp.day
          : isEvening
          ? data.list[0].temp.eve
          : isNightTime && data.list[0].temp.night;
  
        const feelsLike = isDayTime ? data.list[0].feels_like.day : isEvening ? data.list[0].feels_like.eve
          : isNightTime && data.list[0].feels_like.night;
  
        setWeatherData({
          city: data.city.name,
          country: data.city.country,
          temperature: temperatureUnit === 'c' ?`${Number(temperature).toFixed(0)}°C` : `${Number(temperature * 9/5 + 32).toFixed(0)}°F`,
          condition: data.list[0].weather[0].description,
          windSpeed: `${Number(data.list[0].speed).toFixed(0)} km/h`,
          humidity: `${Number(data.list[0].humidity).toFixed(0)}%`,
          feelsLike: temperatureUnit === 'c' ? `${Number(feelsLike).toFixed(0)}°C` : `${Number(feelsLike * 9/5 + 32).toFixed(0)}°F`,
          icon: data.list[0].weather[0].icon,
        });
        // Set the forecast data for the next 7 days
        const forecast = data.list.slice(0, 16).map((dayData: any, index: number) => ({
            day: new Date(dayData.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' }),
            city : data.city.name,
            date : new Date(dayData.dt * 1000).toISOString().split('T')[0],
            condition: dayData.weather[0].description,
            temperature: temperatureUnit === 'c' ? `${Number(dayData.temp.day).toFixed(0)}°C` : `${Number(dayData.temp.day * 9/5 + 32).toFixed(0)}°F`,
            minTemp: temperatureUnit === 'c' ? `${Number(dayData.temp.min).toFixed(0)}°C` : `${Number(dayData.temp.min * 9/5 + 32).toFixed(0)}°F`,
            maxTemp: temperatureUnit === 'c' ? `${Number(dayData.temp.max).toFixed(0)}°C` : `${Number(dayData.temp.max * 9/5 + 32).toFixed(0)}°F`,
            icon: dayData.weather[0].icon,
            hourlyForecast: hourlyData.list.filter((hourData: any) => hourData.dt_txt.split(' ')[0] === new Date(dayData.dt * 1000).toISOString().split('T')[0]),
            Unit : temperatureUnit
          }));
          console.log(data)
          window.scrollTo({top:0, behavior:'smooth'})
          setForecastData(forecast);
          setPickedPlace(null)
          setSearchCity('')


      } catch (error) {
        console.error("Error fetching weather:", error);
      }finally{
        setLoading(false)
      }
    };
  
    fetchForecast();
  }, [searchCity, pickedPlace,temperatureUnit]); // Runs when `searchCity` or `location` changes
  

  return (
    <div className={` ${darkMode ? 'bg-gray-700 text-white':'bg-gradient-to-r from-blue-400 to-sky-500'}`}>
      <div>
        <Navbar searchCity={searchCity} setSearchCity={setSearchCity} darkMode={darkMode} setTemperatureUnit={setTemperatureUnit} temperatureUnit={temperatureUnit}setDarkMode={setDarkMode}></Navbar>
      </div>

      <div className="pt-5">
        <HeroSection searchCity={searchCity} darkMode={darkMode} weatherData={weatherData} loading={loading}></HeroSection>
        <WeatherForecast forecastData={forecastData}></WeatherForecast> 
        <InteractiveWeatherMap darkMode={darkMode}  setPickedPlace={setPickedPlace}></InteractiveWeatherMap>
        <Footer></Footer>
      </div>
    </div>
  );
};

export default HomePage;

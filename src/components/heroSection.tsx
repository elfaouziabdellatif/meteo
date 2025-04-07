import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sun, Wind, Droplet, ThermometerSnowflake, Cloud, CloudRain, CloudSnow } from "lucide-react";
import Spinner from "../helpers/Spinner";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface HeroSectionProps {
  searchCity: string;
  darkMode: boolean;
  weatherData : WeatherData;
  loading: boolean;
}
interface WeatherData {
    city: string;
    country: string;
    temperature: string;
    condition: string;
    windSpeed: string;
    humidity: string;
    feelsLike: string;
    icon: string;
  }
  
export default function HeroSection({ searchCity,darkMode,weatherData,loading }: HeroSectionProps) {
  
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        if(favorites.includes(weatherData.city)){
            setIsFavorite(true);
        }else{
            setIsFavorite(false)
        }
      }, [weatherData.city ]);

    const toggleFavorite = (city: string) => {
        // Get the current favorites from localStorage, or initialize an empty array
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        // Add the city if it's not already included
        if (!isFavorite) {
          favorites.push(city);
          localStorage.setItem("favorites", JSON.stringify(favorites));
          setIsFavorite(true);
        }else if(isFavorite){
            const newFavorites = favorites.filter((item: string) => item !== city);
            localStorage.setItem("favorites", JSON.stringify(newFavorites));
            setIsFavorite(false);
        }


      };
    
  const getLucideIcon = (condition: string) => {
    switch (condition) {
      case "clear sky":
        return <Cloud className="w-24 h-24 text-gray-500-400" />;
      case "rain":
        return <CloudRain className="w-24 h-24 text-blue-500" />;
      case "clouds":
        return <Cloud className="w-24 h-24 text-gray-400" />;
      case "snow":
        return <CloudSnow className="w-24 h-24 text-white" />;
      default:
        return <Sun className="w-24 h-24 text-yellow-400" />;
    }
  };
  // Map weather conditions to icons
  const getWeatherIcon = (weatherData: WeatherData | null) => {
    if (weatherData && weatherData.icon) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${weatherData.icon}@4x.png`}
          alt={weatherData.condition || "Weather Icon"}
          className="w-full h-full"
        />
      );
    }
    return getLucideIcon(weatherData?.condition || "");
  };

  return (
    <div className="w-full relative">
        {loading && (<Spinner></Spinner>)}
      <section className={`relative w-full min-h-[89.5vh]  text-white flex flex-col items-center justify-center p-8 overflow-hidden ${darkMode ? 'bg-gray-700 text-white':''}` }
      key={searchCity}>
        
        {/* Floating Clouds */}

        <div className="absolute left-5 top-10 w-24 h-24 text-white opacity-30 animate-cloud-float">
          {getWeatherIcon(weatherData)}
        </div>
        <div className="absolute right-8 bottom-16 w-28 h-28 text-white opacity-40 animate-cloud-float-alt">
          {getWeatherIcon(weatherData)}
        </div>

        {/* Animated Weather Section */}
        <motion.div
          className="flex flex-col items-center mb-8 "
          initial={{ opacity: 0, y: -50 }}
          
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
            <div className="h-24 w-24 md:h-32 md:w-32  ">
            {getWeatherIcon(weatherData)}
            
            </div>
          
          <motion.h1
            className="text-4xl md:text-6xl  mt-4 font-thin"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, bounce: 0.5 }}
          >
            {weatherData.city}, {weatherData.country}
            <button 
        onClick={()=>toggleFavorite(weatherData.city)}
  className=" p-5  
               rounded-full  
              hover:scale-120 transition-transform duration-300 cursor-pointer"
>
{isFavorite ? (
    <FaHeart className="w-8 h-8 text-red-500 m-auto  shadow-2xl" />
  ) : (
    <FaRegHeart className="w-8 h-8 text-white m-auto shadow-2xl" />
  )}
</button>
          </motion.h1>
          
          <p className="text-lg md:text-2xl mt-5 font-semibold ">{weatherData.condition}</p>
        </motion.div>

        {/* Weather Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {/* Temperature */}
          <motion.div
            className="p-6 text-black bg-blue-300 bg-opacity-10 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ThermometerSnowflake className="mx-auto w-12 h-12 text-white animate-pulse-slow " />
            <p className="text-3xl font-bold mt-2">{weatherData.temperature}</p>
            <p className="text-sm mt-1">Feels Like {weatherData.feelsLike}</p>
          </motion.div>

          {/* Wind Speed */}
          <motion.div
            className="p-6 text-black bg-blue-300 bg-opacity-10 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <Wind className="mx-auto w-12 h-12 0 animate-pulse-slow text-white" />
            <p className="text-3xl font-bold mt-2">{weatherData.windSpeed}</p>
            <p className="text-sm mt-1">Wind Speed</p>
          </motion.div>

          {/* Humidity */}
          <motion.div
            className="p-6 text-black bg-blue-300  bg-opacity-10 rounded-xl shadow-lg backdrop-blur-md hover:scale-105 transition-transform duration-300"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Droplet className="mx-auto w-12 h-12 text-white animate-pulse-slow " />
            <p className="text-3xl font-bold mt-2">{weatherData.humidity}</p>
            <p className="text-sm mt-1">Humidity</p>
          </motion.div>
        </div>

        {/* Floating Animation */}
        <motion.div
          className="absolute bottom-2 left-4 right-4 md:left-auto md:right-8 text-sm text-gray-200 opacity-70"
          initial={{ y: 0 }}
          animate={{ y: [5, 0,5] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        >
          <p>Providing you with real-time weather updates</p>
        </motion.div>
      </section>

      
    </div>
  );
}
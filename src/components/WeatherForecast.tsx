import { motion } from "framer-motion";
import { Key, useState } from "react";

// Fake hourly data for demonstration purposes

interface ForecastData {
  Unit: string;
  date: string;
  city: Key | null | undefined;
  hourlyForecast: any;
  icon: string;
  day: string;
  condition: string;
  temperature: string;
  minTemp: string;
  maxTemp: string;
}

interface WeatherForecastProps {
  forecastData: ForecastData[];
}

export default function WeatherForecast({ forecastData }: WeatherForecastProps) {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [cardPosition, setCardPosition] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [startIndex, setStartIndex] = useState(0);
  const visibleDays = 6; // Show only 6 days

  const handleNext = () => {
    if (startIndex + visibleDays < forecastData.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const handlePrev = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const handleCardClick = (day: string, index: number, event: React.MouseEvent) => {
    // Set the selected day
    setSelectedDay(day);
    setCurrentIndex(index);

    // Get the position and dimensions of the clicked card
    const card = event.currentTarget.getBoundingClientRect();
    console.log(card);
    setCardPosition({
      x: card.left,
      y: card.top,
      width: card.width,
      height: card.height,
    });
  };
  
  // Map weather conditions to icons
  const getWeatherIcon = (icon: string ) => {
    if (icon) {
      return (
        <img
          src={`https://openweathermap.org/img/wn/${icon}@4x.png`}
          alt={icon || "Weather Icon"}
          className=""
        />
      );
    }
    
  };
  // Get the weather icon based on the condition

  
  // Get the background style based on the condition
  const getBackground = (condition: string) => {
    switch (condition.toLowerCase()) {
      case "sky is clear":
        return "bg-gradient-to-r from-blue-400 to-blue-600"; // Bright and clear
      case "few clouds":
        return "bg-gradient-to-r from-blue-300 to-gray-400"; // Light clouds
      case "scattered clouds":
        return "bg-gradient-to-r from-gray-300 to-gray-500"; // Scattered clouds
      case "broken clouds":
        return "bg-gradient-to-r from-gray-400 to-gray-700"; // Heavier clouds
      case "overcast clouds":
        return "bg-gradient-to-r from-gray-500 to-gray-700"; // Very cloudy
      
      case "light rain":
        return "bg-gradient-to-r from-blue-400 to-gray-500"; // Light rain
      case "moderate rain":
        return "bg-gradient-to-r from-blue-500 to-gray-600"; // Normal rain
      case "heavy rain":
      case "very heavy rain":
      case "extreme rain":
        return "bg-gradient-to-r from-blue-700 to-gray-900"; // Heavy rainfall
      case "freezing rain":
        return "bg-gradient-to-r from-blue-500 to-cyan-600"; // Freezing rain (icy blue)
      
      case "light snow":
        return "bg-gradient-to-r from-gray-200 to-blue-300"; // Light snow
      case "snow":
      case "heavy snow":
        return "bg-gradient-to-r from-white to-blue-500"; // Heavy snowfall
      case "sleet":
        return "bg-gradient-to-r from-gray-300 to-blue-500"; // Icy mix
  
      case "thunderstorm":
      case "thunderstorm with light rain":
      case "thunderstorm with rain":
      case "thunderstorm with heavy rain":
        return "bg-gradient-to-r from-gray-800 to-black"; // Dark stormy skies
      case "light thunderstorm":
      case "heavy thunderstorm":
        return "bg-gradient-to-r from-gray-700 to-black"; // Thunderstorm variation
  
      case "mist":
      case "fog":
      case "haze":
        return "bg-gradient-to-r from-gray-400 to-gray-600"; // Foggy/misty conditions
      case "smoke":
        return "bg-gradient-to-r from-gray-500 to-gray-800"; // Smoke (darker fog)
      case "sand":
      case "dust":
        return "bg-gradient-to-r from-yellow-500 to-gray-600"; // Dusty/sandy environment
      case "volcanic ash":
        return "bg-gradient-to-r from-gray-700 to-black"; // Dark ash-filled skies
  
      case "tornado":
        return "bg-gradient-to-r from-gray-900 to-black"; // Tornado warning
      case "squalls":
        return "bg-gradient-to-r from-gray-700 to-blue-800"; // Intense wind/squalls
  
      default:
        return "bg-gradient-to-r from-gray-300 to-gray-500"; // Default (uncategorized weather)
    }
  };
  
  

  return (
    <section className="py-16 px-6">
      <h2 className="text-4xl font-semibold text-center text-white mb-10">7-Day Weather Forecast</h2>
      <div className="flex justify-center flex-col items-center gap-4">
        {/* Left Side: Selected Day Details */}
        {selectedDay && (
          <motion.div
            className={`h-2/5 w-full ${getBackground(forecastData[currentIndex].condition)} relative px-6 py-4 rounded-xl shadow-xl z-20`}
            initial={{
              opacity: 0,
              y: cardPosition.y,
             
              scale: 0.2,
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: 0,
              scale: 1,
            }}
            transition={{ duration: 0.8 }}
            key={selectedDay}
          >
            {/* Header Section */}
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800">{forecastData[currentIndex].day}</h3>
              <div className="flex items-center space-x-2">
                <p className=" font-bold text-gray-800">{forecastData[currentIndex].temperature}</p>
                <span className="w-24 h-24">{getWeatherIcon(forecastData[currentIndex].icon)}</span>
              </div>
            </div>

            {/* Temperature Min/Max */}
            <div className="flex justify-center mt-2 space-x-2">
              <p className="text-sm text-white">{forecastData[currentIndex].minTemp}</p>
              <span className="text-sm text-gray-900">/</span>
              <p className="text-sm text-white">{forecastData[currentIndex].maxTemp}</p>
            </div>

            {/* Condition */}
            <p className="text-sm text-amber-50 text-center mt-1">{forecastData[currentIndex].condition}</p>

            {/* Hourly Forecast */}
            <div className="mt-4">
              <h4 className="text-lg font-semibold text-gray-700">Hourly Forecast</h4>
              <div className="grid grid-cols-2 gap-5 mt-2">
              {forecastData[currentIndex].hourlyForecast.map((hour: {
  dt_txt: string;
  condition: string;
  main: { temp: number };
  weather: { icon: string }[];
}, idx: Key | null | undefined) => (
  <div key={idx} className="flex justify-between items-center text-gray-200 text-base py-3 px-4 border-b border-gray-700">
    
    {/* Time Display */}
    <span className="font-medium w-14 text-center mt-3">{hour.dt_txt.split(' ')[1].slice(0, 5)}</span>

    {/* Icon & Temperature Section */}
    <div className="flex items-center gap-3">
      {/* Weather Icon */}
      <span className="text-white h-8 w-12">{getWeatherIcon(hour.weather[0].icon)}</span>

      {/* Temperature with Celsius Sign */}
      <p className="text-white font-semibold mt-3 w-12"> {forecastData[currentIndex].Unit === 'c' ? hour.main.temp.toFixed()+' °C' : Number(hour.main.temp* 9/5 + 32).toFixed()+' °F'}</p>
    </div>
  </div>
))}

              </div>
            </div>
          </motion.div>
        )}

<div className="relative w-full flex flex-col items-center">
  {/* Left Arrow */}
  <button 
    onClick={handlePrev} 
    disabled={startIndex === 0} 
    className={`absolute left-50 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md ${
      startIndex === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 cursor-pointer"
    }`}
  >
    ◀
  </button>

  {/* Carousel Container */}
  <div className="overflow-hidden w-full max-w-4xl h-full z-10">
    <div 
      className="flex gap-5 transition-transform duration-500 ease-in-out"
      style={{ transform: `translateX(-${startIndex * 180}px)` }} // Adjust width
    >
      {forecastData.map((data, index) => {
        const isDisabled = !data?.hourlyForecast || data?.hourlyForecast.length === 0;

        return (
          <motion.div
            key={index}
            className={`relative p-6 rounded-xl w-40  text-center transition-all duration-300 z-20 ${
              getBackground(data.condition)
            } ${isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "hover:scale-105 hover:shadow-2xl cursor-pointer"}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, delay: index * 0.1 }}
            onClick={(event) => !isDisabled && handleCardClick(data.day, index, event)}
          >
            {/* Tooltip for Disabled Days */}
            {isDisabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl text-white/70 text-sm px-2">
                No hourly forecast available
              </div>
            )}

            <p className="text-lg font-semibold text-gray-800">{data.day}</p>
            <p className="font-semibold text-white/70 underline">{data.date.slice(5)}</p>
            <div className="mt-4 flex justify-center w-24 h-24">
              {getWeatherIcon(data.icon)}
            </div>
            <p className="text-lg font-bold text-gray-800 mt-2">{data.temperature}</p>
            <div className="flex justify-center space-x-4 mt-2">
              <p className="text-sm text-black">{data.minTemp}</p>
              <span className="text-gray-600">/</span>
              <p className="text-sm text-black">{data.maxTemp}</p>
            </div>
            <p className="text-sm text-black mt-2">{data.condition}</p>
          </motion.div>
        );
      })}
    </div>
  </div>

  {/* Right Arrow */}
  <button 
    onClick={handleNext} 
    disabled={startIndex + visibleDays >= forecastData.length} 
    className={`absolute right-50 top-1/2 transform -translate-y-1/2 bg-gray-700 text-white p-2 rounded-full shadow-md ${
      startIndex + visibleDays >= forecastData.length ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800 cursor-pointer"
    }`}
  >
    ▶
  </button>
</div>

      </div>
    </section>
  );
}

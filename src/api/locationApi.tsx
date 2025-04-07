const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export const fetchPlaceName = async (lat: number, lon: number) => {
    try {
        const response = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}&lang=en+ar`
        );
        const data = await response.json();
        return data.length > 0 ? data[0].name : "Unknown Location"; // Returns city name
      } catch (error) {
        console.error("Error fetching place name:", error);
        return "Unable to fetch name";
      }
};


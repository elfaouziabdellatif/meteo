import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { fetchPlaceName } from "../api/locationApi";
import Spinner from "../helpers/Spinner";

const weatherIcon = L.icon({
  iconUrl: "https://upload.wikimedia.org/wikipedia/commons/4/47/PNG_transparency_demonstration_1.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function LocationMarker({ onLocationChange }: { onLocationChange: (latlng: L.LatLng, placeName: string) => void }) {
  const [position, setPosition] = useState<L.LatLng | null>(null);
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useMapEvents({
    click(e) {
      setLoading(true);
      setPosition(e.latlng);
      fetchPlaceName(e.latlng.lat, e.latlng.lng).then((name) => {
        setPlaceName(name);
        onLocationChange(e.latlng, name);
        setLoading(false);
      });
    },
  });

  return position ? (
    <Marker position={position} icon={weatherIcon}>
      <Popup>
        <div className="font-semibold text-center text-xl text-gray-800">Selected Location</div>
        <p className="text-lg text-gray-600">Latitude: {position.lat.toFixed(4)}</p>
        <p className="text-lg text-gray-600">Longitude: {position.lng.toFixed(4)}</p>
        {loading ? <Spinner /> : <p className="text-lg text-gray-600">Place: {placeName}</p>}
      </Popup>
    </Marker>
  ) : null;
}



export default function InteractiveWeatherMap({darkMode, setPickedPlace}: {darkMode: boolean,  setPickedPlace: (latlng: L.LatLng) => void}) {
  
  const [placeName, setPlaceName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; lat: number; lon: number }[]>([]);
  const [selectedCoords, setSelectedCoords] = useState<[number, number] | null>(null);
  const [location, setLocation] = useState<L.LatLng | null>(null);

  const handleLocationChange = (latlng: L.LatLng, name: string) => {
    setLocation(latlng);
    setPlaceName(name);
  };
  function ChangeMapView({ coords }: { coords: [number, number] }) {
    const map = useMap();
    map.setView(coords, 10);
    setSelectedCoords(null)
    return null;
  }
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${searchQuery}`);
    const data = await response.json();
    setSearchResults(
      data.map((item: any) => ({ name: item.display_name, lat: parseFloat(item.lat), lon: parseFloat(item.lon) }))
    );
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && document.activeElement === document.getElementById("searchInput")) {
        handleSearch();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [searchQuery]);

  const handleConfirmLocation = () => {
    if (location && placeName !== 'Unable to fetch name') {
        console.log(location)
      setPickedPlace(location);
    }
  }
  return (
    <section className="relative min-h-screen flex flex-col items-center py-12">
      <h2 className="text-4xl font-semibold underline text-white text-center mb-6">
        Discover Local Weather with Interactive Map
      </h2>

      <div className="flex flex-col sm:flex-row w-full h-[75vh] rounded-lg overflow-hidden mt-3">
        <div className="w-full sm:w-1/2 h-full ml-8 rounded-xl overflow-hidden transition-all">
          <div className="relative w-full">
            <input
              id="searchInput"
              type="text"
              className="w-full p-3 rounded-t-xl border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search for a place..."
              value={searchQuery}
              onChange={(e) => {setSearchQuery(e.target.value) }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <button className="absolute right-3 top-3 text-indigo-600 font-semibold" onClick={handleSearch}>
              🔍
            </button>
            {searchResults.length > 0 && (
              <ul className="absolute bg-white shadow-lg rounded-b-xl w-full z-50">
                {searchResults.slice(0, 5).map((result, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setSelectedCoords([result.lat, result.lon]);
                      setSearchResults([]);
                      setSearchQuery(result.name);
                    }}
                  >
                    {result.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <motion.div className="w-full h-full z-20 bg-amber-300" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
            <MapContainer center={[31.63, -8.01]} zoom={8} scrollWheelZoom={true} className="w-full h-full z-20">
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
              <LocationMarker onLocationChange={handleLocationChange} />
              {selectedCoords && <ChangeMapView coords={selectedCoords} />   }
            </MapContainer>
          </motion.div>
        </div>
        <div className="w-full sm:w-1/2 h-full p-6 flex flex-col justify-center mr-2 ">
          <motion.div
            className="flex flex-col justify-center items-start pr-20 "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className={`text-lg text-gray-600 mb-4 ${darkMode ? "text-white" : "text-gray-600"}`}>
              Click on the map to select a location. Once selected, the weather data for that area will appear.
            </p>

            <div className="text-lg text-gray-600 mb-4">
              <span className="font-semibold text-indigo-600">Instructions:</span> 
              <span className={`ml-2 ${darkMode ? "text-white" : "text-gray-600"}`}
              >Simply click anywhere on the map to choose a location. Zoom in and out to explore different places. After selecting a place, confirm your choice to get weather details.</span>
            </div>

            <div className={`text-lg text-gray-600 mb-4 ${darkMode ? "text-white" : "text-gray-600"}`}>
              <span className={`${darkMode ? "text-white" : "text-gray-600"} font-semibold`}>
              Location : 
              </span>
              {!location && selectedCoords ? <Spinner /> : <span className="text-indigo-800 font-bold ">{placeName || "Select a place"}</span>}
            </div>

            <motion.button
              className={`mt-6 px-6 py-3 ${
                location && placeName !=='Unable to fetch name' ? "bg-indigo-600 hover:bg-indigo-700" : "bg-gray-400 cursor-not-allowed"
              } text-white font-bold rounded-full shadow-lg transition-transform transform ${location && placeName !=='Unable to fetch name' ? "hover:scale-105" : "opacity-50"}`}
              onClick={() => handleConfirmLocation()}
              whileHover={location ? { scale: 1.05 } : undefined}
              whileTap={location ? { scale: 0.95 } : undefined}
              disabled={!location && placeName !=='Unable to fetch name'}
            >
              {location && placeName !=='Unable to fetch name' ? "Confirm Location" : "Select a Location"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
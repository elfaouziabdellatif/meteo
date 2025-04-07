import { useState, useEffect } from "react";
import { ChevronDown, Sun, Moon, Search } from "lucide-react"; // Importing icons
import cities from "../data/cities.json"; // Importing sample data

interface NavbarProps {
  searchCity: string;
  setSearchCity: React.Dispatch<React.SetStateAction<string>>;
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
  setTemperatureUnit: React.Dispatch<React.SetStateAction<string>>;
temperatureUnit: string;
}

const Navbar: React.FC<NavbarProps> = ({ setSearchCity, darkMode, setDarkMode ,setTemperatureUnit,temperatureUnit}) => {
  const [savedCities, setSavedCities] = useState<string[]>(["Paris", "Tokyo", "New York"]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cityInput, setCityInput] = useState(""); // New input state
  const [selectedIndex, setSelectedIndex] = useState(-1); // Track selected index

  const citySuggestions = cities;

  const getFavorites = (): string[] => {
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  };

  useEffect(() => {
    setSavedCities(getFavorites());
  }
    , [localStorage.getItem("favorites")]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [darkMode]);

  const filteredSuggestions = citySuggestions.filter((city) =>
    city.toLowerCase().includes(cityInput.toLowerCase())
  );


  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (cityInput && filteredSuggestions.length > 0) {
        if (e.key === "ArrowDown") {
          setSelectedIndex((prevIndex) => Math.min(prevIndex + 1, filteredSuggestions.length - 1));
        } else if (e.key === "ArrowUp") {
          setSelectedIndex((prevIndex) => Math.max(prevIndex - 1, 0));
        } else if (e.key === "Enter" && selectedIndex !== -1) {
          handleSuggestionClick(filteredSuggestions[selectedIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [cityInput, filteredSuggestions, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0) {
      const selectedElement = document.getElementById(`suggestion-${selectedIndex}`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedIndex]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (cityInput.trim()) {
      setSearchCity(cityInput);
      setCityInput(""); // Reset input field after search
    }
  };

  const handleSuggestionClick = (city: string) => {
    setSearchCity(city);
    setCityInput(""); // Reset input field
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".suggestion-dropdown") && !target.closest(".search-input") && !target.closest(".saved_cities")) {
      setDropdownOpen(false);
    }
  }
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      handleClickOutside(e);
    };
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }
  , []);
  
  return (
    <nav
      className={`${
        !darkMode ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700" : "bg-gray-800"
      } text-white p-4 w-full flex justify-between items-center gap-8 shadow-lg z-50 transition-all duration-300 fixed `}
    >
      <div className="text-2xl font-bold w-1/3">MeteoApp</div>

      <div className="w-1/3">
        <form className="flex items-center space-x-3 relative w-full" onSubmit={handleSearch}>
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            placeholder="Search city..."
            className={`p-2 ${
              darkMode ? "bg-gray-700 focus:ring-blue-500 text-white-600" : "bg-white text-gray-800"
            } rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all duration-200`}
          />
          <button
            type="submit"
            className="cursor-pointer bg-white text-blue-600 px-4 py-2 rounded-full hover:bg-blue-300 duration-75 shadow-md"
          >
            <Search size={18} />
          </button>

          {cityInput && filteredSuggestions.length > 0 && (
            <div className="absolute max-h-48 custom-scrollbar overflow-y-auto left-1.5 top-10 mt-2 w-3/5 bg-white text-gray-700 shadow-lg rounded-md z-10 dark:bg-gray-700 dark:text-white transition-all duration-300">
              {filteredSuggestions.map((city, index) => (
                <div
                  key={index}
                  id={`suggestion-${index}`} // Add unique ID for each suggestion
                  className={`px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-600 ${
                    selectedIndex === index ? "bg-gray-300 dark:bg-gray-600" : ""
                  }`}
                  onClick={() => handleSuggestionClick(city)}
                >
                  {city}
                </div>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="flex items-center gap-4 space-x-6 w-1/3">
        <div className="flex items-center space-x-2">
          <button
            className={`px-3 py-1 rounded-full ${
              temperatureUnit === "c"
                ? "bg-white text-blue-600"
                : darkMode
                ? "bg-gray-500 text-white"
                : "bg-blue-500"
            } cursor-pointer shadow-md transition-all duration-200`}
            onClick={() => setTemperatureUnit("c")}
          >
            °C
          </button>
          <button
            className={`px-3 py-1 rounded-full ${
              temperatureUnit === "f"
                ? "bg-white text-blue-600"
                : darkMode
                ? "bg-gray-500 text-white"
                : "bg-blue-500"
            } cursor-pointer shadow-md transition-all duration-200`}
            onClick={() => setTemperatureUnit("f")}
          >
            °F
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="saved_cities bg-white cursor-pointer text-blue-600 px-4 py-2 rounded-full flex items-center shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200"
          >
            Saved Cities <ChevronDown className="ml-2" size={18} />
          </button>

          {dropdownOpen && (
            <div className="absolute -right-5 mt-2 w-48 bg-white text-gray-700 shadow-lg rounded-md z-10 dark:bg-gray-700 dark:text-white transition-all duration-300">
              {savedCities.length > 0 ? (
                savedCities.map((city, index) => (
                  <div
                    key={index}
                    className="flex justify-between px-4 py-2 hover:bg-gray-200 cursor-pointer dark:hover:bg-gray-600"
                  >
                    <div
                      onClick={() => {
                        setSearchCity(city);
                        setDropdownOpen(false);
                      }}
                    >
                      {city}
                    </div>
                    {/* <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSavedCities((prevCities) => prevCities.filter((savedCity) => savedCity !== city));
                      }}
                      className="cursor-pointer text-red-500 hover:text-red-400 transition duration-150"
                    >
                      X
                    </button> */}
                  </div>
                ))
              ) : (
                <div className="px-4 py-2">No saved cities</div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <div className="text-sm">
            <Sun size={18} />
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full p-1 ${darkMode ? "bg-gray-400" : " bg-yellow-500"}`}
          >
            <div
              className={`w-4 h-4 bg-white rounded-full transition-transform ${
                darkMode ? "transform translate-x-5" : ""
              }`}
            />
          </button>
          <div className="text-sm">
            <Moon size={18} />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

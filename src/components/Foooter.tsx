const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-slate-800 via-slate-900 to-gray-900 text-white py-10 mt-10 shadow-inner  relative overflow-hidden">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-6">
        {/* Left Side */}
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-extrabold tracking-wide">🌤️ Weather Explorer</h2>
          <p className="text-gray-300 mt-2 max-w-xs">
            Your gateway to real-time weather updates — accurate, beautiful, and fast.
          </p>
        </div>

        {/* Center Links */}
        <div className="flex flex-wrap justify-center gap-5 text-sm md:text-base font-medium">
          <a href="#" className="hover:text-sky-400 transition-all">Home</a>
          <a href="#" className="hover:text-sky-400 transition-all">About</a>
          <a href="#" className="hover:text-sky-400 transition-all">Contact</a>
          <a href="#" className="hover:text-sky-400 transition-all">Privacy Policy</a>
        </div>

        {/* Right Side - Social Links */}
        <div className="flex space-x-5 mt-6 md:mt-0">
          <a href="#" className="hover:text-blue-400 transition-all">
            <i className="fab fa-facebook-f text-xl"></i>
          </a>
          <a href="#" className="hover:text-blue-400 transition-all">
            <i className="fab fa-twitter text-xl"></i>
          </a>
          <a href="#" className="hover:text-pink-400 transition-all">
            <i className="fab fa-instagram text-xl"></i>
          </a>
          <a href="#" className="hover:text-gray-300 transition-all">
            <i className="fab fa-github text-xl"></i>
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-gray-400 text-sm">
        &copy; {new Date().getFullYear()} Weather Explorer. All rights reserved.
      </div>

      {/* Optional: Weather icon background (subtle) */}
      <div className="absolute right-4 bottom-4 opacity-10 text-6xl pointer-events-none select-none">
        ⛅
      </div>
    </footer>
  );
};

export default Footer;

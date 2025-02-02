// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FaSun, FaMoon } from 'react-icons/fa'; // Make sure to install react-icons

// function Navbar({ searchgames }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredGames, setFilteredGames] = useState([]);
//   const [darkMode, setDarkMode] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Check if user has a theme preference saved
//     const savedTheme = localStorage.getItem('theme');
//     setDarkMode(savedTheme === 'dark');
//     // Remove any existing theme classes
//     document.body.classList.remove('light', 'dark');
//     // Add the new theme class
//     document.body.classList.add(savedTheme || 'light');
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = darkMode ? 'light' : 'dark';
//     setDarkMode(!darkMode);
//     localStorage.setItem('theme', newTheme);
//     document.body.className = newTheme;
//   };

//   const handleSearch = (e) => {
//     const term = e.target.value.toLowerCase();
//     setSearchTerm(term);

//     // Filter games based on the search term
//     if (term.trim() !== "") {
//       const filtered = searchgames.filter((game) =>
//         game.name.toLowerCase().includes(term)
//       );
//       setFilteredGames(filtered);
//     } else {
//       setFilteredGames([]); // Clear dropdown if no search term
//     }
//   };

//   const handleGameClick = (gameId) => {
//     navigate(`/game/${gameId}`); // Redirect to game details page
//     setSearchTerm(""); // Clear search bar
//     setFilteredGames([]); // Clear dropdown
//   };

//   return (
//     <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
//       <div className="nav-brand">
//         <h2>GameStore</h2>
//       </div>
      
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Search games..."
//           value={searchTerm}
//           onChange={handleSearch}
//           className="search-input"
//         />
//         {filteredGames.length > 0 && (
//           <ul className="search-dropdown">
//             {filteredGames.map((game) => (
//               <li
//                 key={game.id}
//                 className="search-result-item"
//                 onClick={() => handleGameClick(game.id)}
//               > 
//                 <img 
//                   src={game.background_image} 
//                   alt={game.name}
//                   className="search-result-image" 
//                 />
//                 <span className="search-result-name">{game.name}</span>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div className="nav-right">
//         <ul className="nav-links">
//           <li>
//             <Link to="/">Home</Link>
//           </li>
//           <li>
//             <Link to="/browse">Browse Games</Link>
//           </li>
//           <li>
//             <Link to="/contact">Contact</Link>
//           </li>
//         </ul>
        
//         <button className="theme-toggle" onClick={toggleTheme}>
//           {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
//         </button>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;


import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSun, FaMoon } from 'react-icons/fa';

function Navbar({ searchgames }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setDarkMode(savedTheme === 'dark');
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(savedTheme || 'light');
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? 'light' : 'dark';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newTheme);
    document.body.className = newTheme;
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() !== "") {
      const filtered = searchgames.filter((game) =>
        game.name.toLowerCase().includes(term)
      );
      setFilteredGames(filtered);
    } else {
      setFilteredGames([]);
    }
  };

  const handleGameClick = (gameId) => {
    navigate(`/game/${gameId}`);
    setSearchTerm("");
    setFilteredGames([]);
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : 'light'}`}>
      <div className="nav-top">
        <div className="nav-brand">
          <h2>GameStore</h2>
        </div>
        <div className="toggler-mobile">
          <button className="theme-toggle" onClick={toggleTheme}>
            {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
          </button>
        </div> 
        {/* Burger Menu */}
        <div className="burger-menu" onClick={() => setMenuOpen(!menuOpen)}>
          <div className={menuOpen ? "line line1 open" : "line line1"}></div>
          <div className={menuOpen ? "line line2 open" : "line line2"}></div>
          <div className={menuOpen ? "line line3 open" : "line line3"}></div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search games..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        {filteredGames.length > 0 && (
          <ul className="search-dropdown">
            {filteredGames.map((game) => (
              <li
                key={game.id}
                className="search-result-item"
                onClick={() => handleGameClick(game.id)}
              >
                <img 
                  src={game.background_image} 
                  alt={game.name}
                  className="search-result-image" 
                />
                <span className="search-result-name">{game.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
       
      {/* Nav Links and Theme Toggle */}
      <div className={`nav-right ${menuOpen ? "show" : ""}`}>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/browse">Browse Games</Link></li>
          <li><Link to="/contact">Contact</Link></li>
        </ul>
        <div className="toggler-desktop">
        <button className="theme-toggle" onClick={toggleTheme}>
          {darkMode ? <FaSun className="theme-icon" /> : <FaMoon className="theme-icon" />}
        </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;


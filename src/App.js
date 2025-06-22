import React, { Suspense, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GameList from "./components/Gamelist";
import "./App.css";

// Lazy load components
const GameDetails = React.lazy(() => import("./components/GameDetails"));
const Contact = React.lazy(() => import("./components/Contact"));
const BrowseGames = React.lazy(() => import("./components/BrowseGames"));

function App() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        let allGames = [];
        const pageSize = 40;
        const totalPages = 3;

        for (let page = 1; page <= totalPages; page++) {
          const response = await axios.get(`https://api.rawg.io/api/games`, {
            params: {
              key: API_KEY,
              page_size: pageSize,
              page: page,
            },
          });
          allGames = allGames.concat(response.data.results);
        }
        
        setGames(allGames);
        setError(null);
      } catch (error) {
        console.error("Error fetching games:", error);
        setError("Failed to load games. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, [API_KEY]);
  
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar searchgames={games} />
        <main className="flex-grow">
          <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {[...Array(10)].map((_, i) => (
                  <div key={i} className="bg-gray-800 rounded-lg p-4 animate-pulse">
                    <div className="h-48 bg-gray-700 rounded mb-4"></div>
                    <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          }>
            <Routes>
              <Route 
                path="/" 
                element={
                  <GameList 
                    games={games} 
                    isLoading={isLoading} 
                    error={error} 
                  />
                } 
              />
              <Route path="/game/:id" element={<GameDetails />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/browse" element={<BrowseGames />} />
            </Routes>
          </Suspense>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

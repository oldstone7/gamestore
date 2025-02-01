import React, { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import GameList from "./components/GameList";
import axios from "axios";
import { useState, useEffect } from "react";
import "./App.css";

// Lazy load GameDetails
const GameDetails = React.lazy(() => import("./components/GameDetails"));

function App() {
  const [games, setGames] = useState([]);
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
  useEffect(() => {
    const fetchGames = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };
    fetchGames();
  }, [API_KEY]);
  
  return (
    <Router>
      <Navbar searchgames = {games}/>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<GameList games={games}/>} />
          <Route path="/game/:id" element={<GameDetails />} />
        </Routes>
      </Suspense>
      <Footer />
    </Router>
  );
}

export default App;

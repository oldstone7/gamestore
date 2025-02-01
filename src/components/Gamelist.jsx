import React, { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "./GameCard";

const GameList = ({ games }) => {
  const [filteredGames, setFilteredGames] = useState([]); // State for filtered games
  const [genres, setGenres] = useState([]); // State for genres list
  const [selectedGenre, setSelectedGenre] = useState(""); // State for selected genre
  const [searchQuery, setSearchQuery] = useState("");     // State for search term
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/genres`, {
          params: { key: API_KEY },
        });
        setGenres(response.data.results); // Store genres in state
      } catch (error) {
        console.error("Error fetching genres:", error);
      }
    };

    fetchGenres();
  }, [API_KEY]);

  // Update filtered games when `games` or `selectedGenre` changes
  useEffect(() => {
    if (games) {
      if (selectedGenre === "") {
        setFilteredGames(games); // Show all games if no genre is selected
      } else {
        const filtered = games.filter((game) =>
          game.genres.some((g) => g.slug === selectedGenre)
        );
        setFilteredGames(filtered);
      }
    }
  }, [games, selectedGenre]);

  // Handle genre change from dropdown
  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);
    filterGames(genre, searchQuery);
  };



  // Filter games based on genre and search query
  const filterGames = (genre, query) => {
    let filtered = games;

    if (genre !== "") {
      filtered = filtered.filter((game) =>
        game.genres.some((g) => g.slug === genre)
      );
    }

    if (query !== "") {
      filtered = filtered.filter((game) =>
        game.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredGames(filtered);
  };

  return (
    <>
      <div className="filter-section">
        <label htmlFor="genre-filter">Filter by Genre: </label>
        <select
          id="genre-filter"
          value={selectedGenre}
          onChange={handleGenreChange}
        >
          <option value="">All</option>
          {genres.map((genre) => (
            <option key={genre.id} value={genre.slug}>
              {genre.name}
            </option>
          ))}
        </select>

        
      </div>

      <div className="game-list">
        {filteredGames.length ? (
          filteredGames.map((game) => <GameCard key={game.id} game={game} />)
        ) : (
          <p>Loading games...</p>
        )}
      </div>
    </>
  );
};

export default GameList;

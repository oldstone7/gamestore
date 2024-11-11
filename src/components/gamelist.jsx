import React, { useEffect, useState } from "react";
import axios from "axios";

const GameList = () => {
  const [games, setGames] = useState([]);            // State for all games
  const [filteredGames, setFilteredGames] = useState([]); // State for filtered games
  const [genres, setGenres] = useState([]);           // State for genres list
  const [selectedGenre, setSelectedGenre] = useState(""); // State for selected genre
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  useEffect(() => {
    // Fetch games from API
    const fetchGames = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games`, {
          params: {
            key: API_KEY,
            page_size: 50, // Fetch 50 games
          },
        });
        setGames(response.data.results);            // Store all games
        setFilteredGames(response.data.results);    // Initialize filtered games as all games
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    // Fetch genres from API
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

    fetchGames();
    fetchGenres();
  }, [API_KEY]);

  // Handle genre change from dropdown
  const handleGenreChange = (event) => {
    const genre = event.target.value;
    setSelectedGenre(genre);

    // Filter games based on selected genre
    if (genre === "") {
      setFilteredGames(games); // If no genre selected, show all games
    } else {
      const filtered = games.filter((game) =>
        game.genres.some((g) => g.slug === genre) // Match by genre slug
      );
      setFilteredGames(filtered);
    }
  };

  return (
    <>
      <div className="filter-section">
        <label htmlFor="genre-filter">Filter by Genre: </label>
        <select id="genre-filter" value={selectedGenre} onChange={handleGenreChange}>
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
          filteredGames.map((game) => (
            <div key={game.id} className="game-card">
              <img src={game.background_image} alt={game.name} />
              <h3>{game.name}</h3>
              <p>Released: {game.released}</p>
              <p>Rating: {game.rating}</p>
              <p>{game.genres.map((genre) => genre.name).join(", ")}</p>
            </div>
          ))
        ) : (
          <p>Loading games...</p>
        )}
      </div>
    </>
  );
};

export default GameList;

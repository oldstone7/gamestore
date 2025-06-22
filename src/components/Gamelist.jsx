import React, { useEffect, useState } from "react";
import axios from "axios";
import GameCard from "./GameCard";
import SkeletonGameCard from "./SkeletonGameCard";

const GameList = ({ games, isLoading, error }) => {
  const [filteredGames, setFilteredGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [isGenresLoading, setIsGenresLoading] = useState(true);
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  // Fetch genres when component mounts
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setIsGenresLoading(true);
        const response = await axios.get(`https://api.rawg.io/api/genres`, {
          params: { key: API_KEY },
        });
        setGenres(response.data.results);
      } catch (error) {
        console.error("Error fetching genres:", error);
      } finally {
        setIsGenresLoading(false);
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
    filterGames(genre);
  };



  // Filter games based on genre
  const filterGames = (genre) => {
    if (!genre) {
      setFilteredGames(games);
      return;
    }
    
    const filtered = games.filter((game) =>
      game.genres && game.genres.some((g) => g.slug === genre)
    );
    
    setFilteredGames(filtered);
  };

  // Show loading state
  if (isLoading || isGenresLoading) {
    return (
      <div className="w-full px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="filter-label animate-pulse h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="filter-select animate-pulse bg-gray-200 dark:bg-gray-700 h-10 w-64"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-full h-full">
                <SkeletonGameCard />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-lg max-w-2xl mx-auto">
          <h3 className="font-bold text-xl mb-2">Error Loading Games</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Show no games found state
  if (filteredGames.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-gray-800/50 border border-gray-700 text-gray-300 px-4 py-8 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold mb-2">No Games Found</h3>
          <p className="mb-4">We couldn't find any games matching your criteria.</p>
          <button
            onClick={() => {
              setSelectedGenre('');
              setFilteredGames(games);
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label htmlFor="genre-filter" className="filter-label">
              Filter by Genre:
            </label>
            <select
              id="genre-filter"
              value={selectedGenre}
              onChange={handleGenreChange}
              className="filter-select"
            >
              <option value="">All Genres</option>
              {genres.map((genre) => (
                <option key={genre.id} value={genre.slug}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5 md:gap-6">
          {filteredGames.map((game) => (
            <div key={game.id} className="w-full h-full">
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameList;

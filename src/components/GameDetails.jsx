import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const GameDetails = () => {
  const { id } = useParams(); // Get the game ID from the URL
  const [gameDetails, setGameDetails] = useState(null);
  const API_KEY = process.env.REACT_APP_RAWG_API_KEY;

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await axios.get(`https://api.rawg.io/api/games/${id}`, {
          params: { key: API_KEY },
        });
        setGameDetails(response.data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      }
    };

    fetchGameDetails();
  }, [id, API_KEY]);

  if (!gameDetails) return <p>Loading...</p>;

  return (
    <div className="game-details">
      <img src={gameDetails.background_image} alt={gameDetails.name} className="large-image" />
      <h1>{gameDetails.name}</h1>
      <p>{gameDetails.description_raw}</p>
      <h3>Platforms:</h3>
      <p>{gameDetails.platforms.map((p) => p.platform.name).join(", ")}</p>

    <h3>Genres:</h3>
    <p>{gameDetails.genres.map((genre) => genre.name).join(", ")}</p>

    <h3>System Requirements:</h3>
    {gameDetails.platforms.map((p) =>
    p.platform.name === "PC" && p.requirements ? ( // Check if platform is PC and requirements exist
        <div key={p.platform.id}>
        <p>Minimum: {p.requirements.minimum}</p>
        <p>Recommended: {p.requirements.recommended}</p>
        </div>
    ) : null
    )}
   </div>
  );
};

export default GameDetails;

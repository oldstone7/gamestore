import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <div className="game-card">
      <img src={game.background_image} alt={game.name} />
      <h3>{game.name}</h3>
      <p>Released: {game.released}</p>
      <p>Rating: {game.rating}</p>
      <p>{game.genres.map((genre) => genre.name).join(", ")}</p>
      <Link to={`/game/${game.id}`}>
        <button>Show Details</button>
      </Link>
    </div>
  );
};

export default GameCard;

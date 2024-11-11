import React from 'react';

function GameCard({ image, name, description, onViewDetails }) {
  return (
    <div className="game-card">
      <img src={image} alt={`${name} cover`} className="game-card-image" />
      <h3>{name}</h3>
      <p>{description}</p>
      <button onClick={onViewDetails}>View Details</button>
    </div>
  );
}

export default GameCard;

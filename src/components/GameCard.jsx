import React from "react";
import { Link } from "react-router-dom";

const GameCard = ({ game }) => {
  return (
    <div className="group h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl hover:ring-2 hover:ring-blue-500 border border-gray-200 dark:border-gray-700 hover:scale-105 transform-gpu">
      <div className="relative pt-[56.25%] overflow-hidden">
        <img 
          src={game.background_image || '/placeholder-game.jpg'} 
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder-game.jpg';
          }}
        />
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-white font-bold text-lg mb-2 line-clamp-2" title={game.name}>
          {game.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
            <span>⭐ {game.rating || 'N/A'}</span>
            <span>{game.released?.split('-')[0] || 'N/A'}</span>
          </div>
          
          {game.genres?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {game.genres.slice(0, 2).map((genre) => (
                <span 
                  key={genre.id} 
                  className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                >
                  {genre.name}
                </span>
              ))}
              {game.genres.length > 2 && (
                <span className="text-xs text-gray-500 self-center">+{game.genres.length - 2} more</span>
              )}
            </div>
          )}
          
          <Link 
            to={`/game/${game.id}`}
            className="block w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameCard;

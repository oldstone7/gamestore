import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchGames, fetchGenres, fetchPlatforms, buildFilters } from '../services/api';
import GameCard from './GameCard';
import { 
  FiFilter, 
  FiGrid, 
  FiList, 
  FiSearch, 
  FiChevronDown,  
  FiChevronLeft,
  FiChevronRight, 
  FiX 
} from 'react-icons/fi';
import SkeletonGameCard from './SkeletonGameCard';

const SORT_OPTIONS = [
  { value: '-added', label: 'Recently Added' },
  { value: '-released', label: 'Newest Releases' },
  { value: '-metacritic', label: 'Most Popular' },
  { value: '-rating', label: 'Top Rated' },
  { value: 'name', label: 'Name (A-Z)' },
];

const BrowseGames = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // View mode state with localStorage persistence
  const [viewMode, setViewMode] = useState(() => {
    // Initialize view mode from localStorage on component mount
    const savedViewMode = localStorage.getItem('gameStoreViewMode');
    if (savedViewMode) {
      return savedViewMode;
    }
    return 'grid';
  });
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('gameStoreViewMode', mode);
  };

  useEffect(() => {
    const savedViewMode = localStorage.getItem('gameStoreViewMode');
    if (savedViewMode) {
      setViewMode(savedViewMode);
    }
  }, []);

  // Filter states with URL sync
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedGenres, setSelectedGenres] = useState(
    searchParams.get('genres') ? searchParams.get('genres').split(',').map(Number).filter(Boolean) : []
  );
  const [selectedPlatforms, setSelectedPlatforms] = useState(
    searchParams.get('platforms') ? searchParams.get('platforms').split(',').map(Number).filter(Boolean) : []
  );
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || '-added');
  const [dateRange, setDateRange] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || new Date().toISOString().split('T')[0],
  });
  const [minRating, setMinRating] = useState(Number(searchParams.get('rating')) || 0);

  // Fetch initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        const [genresData, platformsData] = await Promise.all([
          fetchGenres(),
          fetchPlatforms(),
        ]);
        setGenres(genresData);
        setPlatforms(platformsData);
      } catch (err) {
        setError('Failed to load initial data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (searchQuery) params.set('search', searchQuery);
    if (selectedGenres.length > 0) params.set('genres', selectedGenres.join(','));
    if (selectedPlatforms.length > 0) params.set('platforms', selectedPlatforms.join(','));
    if (sortBy !== '-added') params.set('sort', sortBy);
    if (dateRange.from) params.set('from', dateRange.from);
    if (dateRange.to !== new Date().toISOString().split('T')[0]) params.set('to', dateRange.to);
    if (minRating > 0) params.set('rating', minRating);
    
    // Update URL without causing a navigation
    setSearchParams(params, { replace: true });
  }, [searchQuery, selectedGenres, selectedPlatforms, sortBy, dateRange, minRating, setSearchParams]);

  // Fetch games when filters change
  useEffect(() => {
    const loadGames = async () => {
      try {
        setLoading(true);
        const filters = {
          search: searchQuery,
          genres: selectedGenres,
          platforms: selectedPlatforms,
          dates: {
            from: dateRange.from,
            to: dateRange.to,
          },
          rating: minRating,
        };
        
        const params = {
          ...buildFilters(filters),
          ordering: sortBy,
        };
        
        const data = await fetchGames(params);
        setGames(data.results);
      } catch (err) {
        setError('Failed to load games');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, [searchQuery, selectedGenres, selectedPlatforms, sortBy, dateRange, minRating]);

  const toggleGenre = (genreId) => {
    setSelectedGenres(prev => 
      prev.includes(genreId) 
        ? prev.filter(id => id !== genreId)
        : [...prev, genreId]
    );
  };

  const togglePlatform = (platformId) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedGenres([]);
    setSelectedPlatforms([]);
    setDateRange({
      from: '',
      to: new Date().toISOString().split('T')[0],
    });
    setMinRating(0);
    setSortBy('-rating');
  };

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FiFilter />
            {isMobileFiltersOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {/* Sidebar Filters */}
        <div 
          className={`${isMobileFiltersOpen ? 'block' : 'hidden'} md:block w-full md:w-64 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg h-fit`}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
            <button 
              onClick={clearFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search games..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <FiSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {/* Genres */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Genres</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {genres.map((genre) => (
                <div key={genre.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`genre-${genre.id}`}
                    checked={selectedGenres.includes(genre.id)}
                    onChange={() => toggleGenre(genre.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`genre-${genre.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {genre.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Platforms */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Platforms</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto p-1">
              {platforms.map((platform) => (
                <div key={platform.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`platform-${platform.id}`}
                    checked={selectedPlatforms.includes(platform.id)}
                    onChange={() => togglePlatform(platform.id)}
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500"
                  />
                  <label 
                    htmlFor={`platform-${platform.id}`}
                    className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    {platform.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Release Date */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Release Date</h4>
            <div className="space-y-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
          
          {/* Rating */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Minimum Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
            </h4>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={minRating}
              onChange={(e) => setMinRating(Number(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Any</span>
              <span>100</span>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-1">
          {/* Header with sort and view toggle */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <h1 
              className="text-2xl font-bold"
              style={{ color: 'var(--text)' }}
            >
              
              {searchQuery ? `Search: ${searchQuery}` : 'Browse Games'}
              {selectedGenres.length > 0 && (
                <span className="text-gray-700 dark:text-gray-400 text-lg font-normal">
                  {' '}({games.length} games found)
                </span>
              )}
            </h1>
            
            <div className="flex items-center gap-4">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md pl-3 pr-8 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
                  <FiChevronDown className="h-4 w-4" />
                </div>
              </div>
              
              {/* View Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-md overflow-hidden">
                <button
                  onClick={() => toggleViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  aria-label="Grid view"
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => toggleViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'}`}
                  aria-label="List view"
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Active Filters */}
          {(selectedGenres.length > 0 || selectedPlatforms.length > 0 || minRating > 0) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedGenres.map((genreId) => {
                const genre = genres.find(g => g.id === genreId);
                return genre ? (
                  <span 
                    key={`genre-${genreId}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                  >
                    {genre.name}
                    <button 
                      onClick={() => toggleGenre(genreId)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 dark:bg-blue-700 hover:bg-blue-300 dark:hover:bg-blue-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
              
              {selectedPlatforms.map((platformId) => {
                const platform = platforms.find(p => p.id === platformId);
                return platform ? (
                  <span 
                    key={`platform-${platformId}`}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {platform.name}
                    <button 
                      onClick={() => togglePlatform(platformId)}
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-green-200 dark:bg-green-700 hover:bg-green-300 dark:hover:bg-green-600"
                    >
                      <FiX className="h-3 w-3" />
                    </button>
                  </span>
                ) : null;
              })}
              
              {minRating > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  Rating: {minRating}+
                  <button 
                    onClick={() => setMinRating(0)}
                    className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-yellow-200 dark:bg-yellow-700 hover:bg-yellow-300 dark:hover:bg-yellow-600"
                  >
                    <FiX className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}
          
          {/* Loading State */}
          {loading ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'}
            >
              {[...Array(4)].map((_, i) => (
                <SkeletonGameCard key={i} viewMode={viewMode} />
              ))}
            </div>
          ) : games.length > 0 ? (
            /* Games Grid/List View */
            viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {games.map((game) => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {games.map((game) => (
                  <div 
                    key={game.id} 
                    className="group flex flex-col sm:flex-row gap-4 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:border-blue-500 transform hover:-translate-y-1 hover:ring-2 hover:ring-blue-500/20"
                  >
                    <div className="w-full sm:w-48 h-48 flex-shrink-0">
                      <img 
                        src={game.background_image || '/placeholder-game.jpg'}
                        alt={game.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/placeholder-game.jpg';
                        }}
                      />
                    </div>
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {game.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        {game.metacritic && (
                          <span className={`px-2 py-1 text-xs font-semibold rounded ${
                            game.metacritic >= 75 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            game.metacritic >= 50 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {game.metacritic}
                          </span>
                        )}
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {new Date(game.released).getFullYear() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {game.genres?.slice(0, 3).map(genre => (
                          <span 
                            key={genre.id}
                            className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full"
                          >
                            {genre.name}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3 mb-4">
                        {game.description || game.description_raw || 'No description available.'}
                      </p>
                      <button 
                        onClick={() => window.location.href = `/game/${game.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* No Results */
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎮</div>
              <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No games found</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button 
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
          
          {/* Pagination */}
          {games.length > 0 && (
            <div className="mt-8 flex justify-center">
              <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                  disabled
                >
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-5 w-5" />
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-200 text-sm font-medium"
                >
                  1
                </button>
                <button
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 text-sm font-medium"
                >
                  2
                </button>
                <button
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BrowseGames;

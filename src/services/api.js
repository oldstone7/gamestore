import axios from 'axios';

const API_KEY = process.env.REACT_APP_RAWG_API_KEY;
const BASE_URL = 'https://api.rawg.io/api';

// List of tags to exclude (adult content, nudity, etc.)
const EXCLUDED_TAGS = [
  'nsfw',
  'nudity',
  'adult',
  'sexual-content',
  'explicit',
  'mature',
  'pregnancy',
  'prostitution'
];

export const fetchGames = async (params = {}) => {
  try {
    // Start with basic params
    const baseParams = {
      key: API_KEY,
      page_size: 40, // Reduced for better performance
      ordering: '-added', // Default sort by recently added
      ...params,
    };

    console.log('Fetching games with params:', baseParams);

    const response = await axios.get(`${BASE_URL}/games`, {
      params: baseParams,
    });

    console.log('Raw API response:', response.data);

    // Client-side filtering for mature content
    const filteredResults = {
      ...response.data,
      results: response.data.results.filter(game => {
        // Skip if no game data
        if (!game) return false;

        const gameName = game.name?.toLowerCase() || '';
        
        // Check game name for excluded terms
        const hasExcludedInName = EXCLUDED_TAGS.some(tag => 
          gameName.includes(tag)
        );
        
        // Check tags if available
        const hasExcludedTag = game.tags?.some(tag => 
          tag && (EXCLUDED_TAGS.includes(tag.slug) || 
                 EXCLUDED_TAGS.includes(tag.name?.toLowerCase()))
        ) || false;
        
        // Check ESRB rating
        const isMatureRating = [
          'adults-only',
          'm',
          'ao',       
        ].includes(game.esrb_rating?.slug?.toLowerCase() || '');

        console.log('Game:', game.name, {
          hasExcludedInName,
          hasExcludedTag,
          isMatureRating,
          rating: game.esrb_rating?.slug
        });

        // Only include if none of the exclusion conditions are met
        return !hasExcludedInName && !hasExcludedTag && !isMatureRating;
      })
    };
    
    console.log('Filtered results:', filteredResults);
    return filteredResults;
  } catch (error) {
    console.error('Error fetching games:', error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/genres`, {
      params: {
        key: API_KEY,
        page_size: 40,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const fetchPlatforms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/platforms`, {
      params: {
        key: API_KEY,
        page_size: 40,
      },
    });
    return response.data.results;
  } catch (error) {
    console.error('Error fetching platforms:', error);
    throw error;
  }
};

// Helper function to build filters for the API
export const buildFilters = (filters) => {
  const params = {};
  
  if (filters.genres?.length) {
    params.genres = filters.genres.join(',');
  }
  
  if (filters.platforms?.length) {
    params.platforms = filters.platforms.join(',');
  }
  
  if (filters.search) {
    params.search = filters.search;
  }
  
  if (filters.dates) {
    // Format: YYYY-MM-DD,YYYY-MM-DD
    const fromDate = filters.dates.from || '1950-01-01';
    const toDate = filters.dates.to || new Date().toISOString().split('T')[0];
    params.dates = `${fromDate},${toDate}`;
  }
  
  if (filters.rating) {
    params.metacritic = `${filters.rating},100`;
  }
  
  return params;
};

const API_KEY = import.meta.env.VITE_HERE_API_KEY;
const MAX_RESULTS = 5;

const fetchGeocodeResults = (value: string): Promise<any> => {
  const url = `https://geocode.search.hereapi.com/v1/geocode?q=${value}&limit=${MAX_RESULTS}&apiKey=${API_KEY}`;
  return fetch(url)
    .then(result => result.json());
};

export default fetchGeocodeResults;

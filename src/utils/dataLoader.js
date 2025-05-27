import Papa from 'papaparse';

// Load CSV file from /public
export const loadFarmersMarkets = async () => {
  const response = await fetch('/farmersMarkets.csv');
  const csvText = await response.text();
  return new Promise((resolve, reject) => {
    Papa.parse(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: results => resolve(results.data),
      error: err => reject(err)
    });
  });
};

// Load GeoJSON from /public
export const loadCountiesGeoJSON = async () => {
  const response = await fetch('/counties.geojson');
  if (!response.ok) throw new Error('Failed to load counties.geojson');
  return await response.json();
};

// Helper: Get the mode (most common value) of an array
const mode = arr => {
  const freq = {};
  arr.forEach(v => { if (v) freq[v] = (freq[v] || 0) + 1; });
  let max = 0, res = null;
  for (const k in freq) { if (freq[k] > max) { max = freq[k]; res = k; } }
  return res;
};

// Helper: Validate MM/DD/YYYY to MM/DD/YYYY "start to end" format
function isValidSeasonDate(dateStr) {
  if (!dateStr) return false;
  try {
    const [start, end] = dateStr.split(' to ');
    if (!start || !end) return false;
    // Check MM/DD/YYYY format
    const datePattern = /^\d{2}\/\d{2}\/\d{4}$/;
    return datePattern.test(start.trim()) && datePattern.test(end.trim());
  } catch {
    return false;
  }
}

// Helper: Try to correct 'Month DD, YYYY' to 'MM/DD/YYYY'
function correctSeasonDate(dateStr) {
  if (!dateStr) return null;
  try {
    const [start, end] = dateStr.split(' to ');
    const parseDate = d => {
      // If already MM/DD/YYYY, return as is
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(d.trim())) return d.trim();
      // Otherwise, try to parse "Month DD, YYYY"
      const jsDate = new Date(d.trim());
      if (isNaN(jsDate)) return null;
      return jsDate.toLocaleDateString('en-US');
    };
    const s = parseDate(start);
    const e = parseDate(end);
    if (s && e) return `${s} to ${e}`;
    return null;
  } catch {
    return null;
  }
}

// --- Update preprocessMarkets to include this logic ---
export function preprocessMarkets(markets) {
  const productColumns = [
    'Organic', 'Bakedgoods', 'Cheese', 'Crafts', 'Flowers', 'Eggs', 'Seafood', 'Herbs',
    'Vegetables', 'Honey', 'Jams', 'Maple', 'Meat', 'Nursery', 'Nuts', 'Plants',
    'Poultry', 'Prepared', 'Soap', 'Trees', 'Wine', 'Coffee', 'Beans', 'Fruits',
    'Grains', 'Juices', 'Mushrooms', 'PetFood', 'Tofu', 'WildHarvested'
  ];
  const seasonColumns = ['Season1Date', 'Season2Date', 'Season3Date', 'Season4Date'];

  let filtered = markets.filter(m => m.x && m.y);

  productColumns.forEach(col => {
    const values = filtered.map(m => (m[col] === '-' ? 'N' : m[col])).filter(v => v !== undefined && v !== null && v !== '');
    const mostCommon = mode(values);
    filtered.forEach(m => {
      if (m[col] === '-' || m[col] === undefined || m[col] === null || m[col] === '') m[col] = mostCommon;
    });
  });

  // Clean up season date columns
  filtered.forEach(m => {
    seasonColumns.forEach(col => {
      if (m[col]) {
        // If not valid, try to correct it
        if (!isValidSeasonDate(m[col])) {
          const corrected = correctSeasonDate(m[col]);
          m[col] = corrected ? corrected : null;
        }
      }
    });
  });

  // Clean up updateTime to YYYY-MM-DD
  filtered.forEach(m => {
    if (m.updateTime) {
      const date = new Date(m.updateTime);
      if (!isNaN(date)) {
        m.updateTime = date.toISOString().slice(0, 10);
      }
    }
  });

  return filtered;
}

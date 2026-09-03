import fs from 'fs';
import path from 'path';
import os from 'os';

const initialFavorites = [
  {
    id: 'fav-1',
    quote: 'The only way to do great work is to love what you do.',
    author: 'Steve Jobs',
    category: 'Inspiration',
    saved_at: '2026-09-01T10:00:00.000Z'
  },
  {
    id: 'fav-2',
    quote: 'In the middle of every difficulty lies opportunity.',
    author: 'Albert Einstein',
    category: 'Wisdom',
    saved_at: '2026-09-02T14:30:00.000Z'
  }
];

const databasePath = path.join(os.tmpdir(), 'quotes_favorites_database.json');

function readDatabaseTable() {
  if (globalThis.__quoteFavoritesTable) {
    return globalThis.__quoteFavoritesTable;
  }

  try {
    if (fs.existsSync(databasePath)) {
      const fileData = fs.readFileSync(databasePath, 'utf8');
      const parsedRecords = JSON.parse(fileData);
      if (Array.isArray(parsedRecords)) {
        globalThis.__quoteFavoritesTable = parsedRecords;
        return globalThis.__quoteFavoritesTable;
      }
    }
  } catch (error) {}

  globalThis.__quoteFavoritesTable = [...initialFavorites];
  writeDatabaseTable(globalThis.__quoteFavoritesTable);
  return globalThis.__quoteFavoritesTable;
}

function writeDatabaseTable(records) {
  try {
    fs.writeFileSync(databasePath, JSON.stringify(records, null, 2), 'utf8');
  } catch (error) {}
}

export function getAllFavorites() {
  const records = readDatabaseTable();
  return [...records].reverse();
}

export function addFavorite({ quote, author, category }) {
  const records = readDatabaseTable();
  const cleanQuote = quote.trim();
  const cleanAuthor = author.trim();

  const existing = records.find(
    item => item.quote.toLowerCase() === cleanQuote.toLowerCase()
  );

  if (existing) {
    return existing;
  }

  const newFavorite = {
    id: 'fav-' + Date.now(),
    quote: cleanQuote,
    author: cleanAuthor || 'Unknown',
    category: category || 'General',
    saved_at: new Date().toISOString()
  };

  records.push(newFavorite);
  writeDatabaseTable(records);
  return newFavorite;
}

export function removeFavorite(id) {
  const records = readDatabaseTable();
  const filtered = records.filter(item => item.id !== id);

  if (filtered.length !== records.length) {
    globalThis.__quoteFavoritesTable = filtered;
    writeDatabaseTable(filtered);
    return true;
  }

  return false;
}

export function checkIsFavorite(quote) {
  const records = readDatabaseTable();
  const cleanQuote = (quote || '').trim().toLowerCase();
  return records.some(item => item.quote.toLowerCase() === cleanQuote);
}

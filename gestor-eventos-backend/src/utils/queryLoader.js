import fs from 'fs';
import path from 'path';

const queriesPath = path.resolve('src/config/queries.json');

let queries = null;

function loadQueries() {
  if (!queries) {
    const raw = fs.readFileSync(queriesPath, 'utf-8');
    queries = JSON.parse(raw);
  }
}

export function getQuery(key) {
  loadQueries();
  if (!queries[key]) {
    throw new Error(`Query no definida: ${key}`);
  }
  return queries[key];
}
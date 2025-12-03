import fs from 'fs';
import path from 'path';

const queriesPath = path.resolve('src/config/queries.json');
const authQueriesPath = path.resolve('src/config/auth_queries.json');

let queries = null;

function loadQueries() {
  if (!queries) {
    const raw = fs.readFileSync(queriesPath, 'utf-8');
    const jsonQueries = JSON.parse(raw);

    const rawAuth = fs.readFileSync(authQueriesPath, 'utf-8');
    const jsonAuthQueries = JSON.parse(rawAuth);

    queries = { ...jsonQueries, ...jsonAuthQueries };
  }
}

export function getQuery(key) {
  loadQueries();
  if (!queries[key]) {
    throw new Error(`Query no definida: ${key}`);
  }
  return queries[key];
}
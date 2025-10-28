// src/services/redisClient.js
import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

client.on('error', (err) => console.error('Redis error:', err));

let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
    console.log('Redis conectado');
  }
  return client;
}
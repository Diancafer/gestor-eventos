import { createClient } from 'redis';

const client = createClient({
  socket: {
    host: '127.0.0.1',
    port: 6379
  }
});

client.on('error', (err) => {
  console.error('Redis error:', err);
});

let isConnected = false;

export async function getRedisClient() {
  if (!isConnected) {
    console.log('Intentando conectar a Redis...');
    try {
      await client.connect();
      isConnected = true;
      console.log('Redis conectado');
    } catch (error) {
      console.error('Error al conectar con Redis:', error);
    }
  }
  return client;
}
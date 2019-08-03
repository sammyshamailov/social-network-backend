import dotenv from 'dotenv';

export function initConfig() {
  dotenv.config();
}

export function getConfig(key: string, fallback?: any) {
  return process.env[key] || fallback;
}

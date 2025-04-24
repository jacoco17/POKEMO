import axios from 'axios';
import { Pokemon, Battle, TeamMember } from '../types/pokemon';

const POKE_API_BASE = 'https://pokeapi.co/api/v2';
const JSON_SERVER_BASE = 'http://localhost:3001';

// Create axios instance with timeout and error handling
const api = axios.create({
  baseURL: JSON_SERVER_BASE,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// PokeAPI services
export const getPokemonList = async (offset = 0, limit = 20) => {
  const response = await axios.get(`${POKE_API_BASE}/pokemon?offset=${offset}&limit=${limit}`);
  return response.data;
};

export const getPokemonByNameOrId = async (nameOrId: string | number): Promise<Pokemon> => {
  const response = await axios.get(`${POKE_API_BASE}/pokemon/${nameOrId.toString().toLowerCase()}`);
  return response.data;
};

// Team services
export const getTeam = async (): Promise<TeamMember[]> => {
  try {
    const response = await api.get('/team');
    return response.data;
  } catch (error) {
    console.error('Error fetching team:', error);
    return [];
  }
};

export const addToTeam = async (pokemon: Pokemon): Promise<TeamMember> => {
  const teamMember: TeamMember = {
    ...pokemon,
    addedAt: new Date().toISOString(),
  };
  try {
    const response = await api.post('/team', teamMember);
    return response.data;
  } catch (error) {
    console.error('Error adding to team:', error);
    throw error;
  }
};

export const removeFromTeam = async (id: number): Promise<void> => {
  try {
    await api.delete(`/team/${id}`);
  } catch (error) {
    console.error('Error removing from team:', error);
    throw error;
  }
};

// Battle services
export const saveBattle = async (battle: Omit<Battle, 'id'>): Promise<Battle> => {
  try {
    const response = await api.post('/battles', battle);
    return response.data;
  } catch (error) {
    console.error('Error saving battle:', error);
    throw error;
  }
};

export const getBattleHistory = async (): Promise<Battle[]> => {
  try {
    const response = await api.get('/battles');
    return response.data;
  } catch (error) {
    console.error('Error fetching battle history:', error);
    return [];
  }
};

// Favorites services
export const addToFavorites = async (pokemon: Pokemon): Promise<Pokemon> => {
  try {
    const response = await api.post('/favorites', pokemon);
    return response.data;
  } catch (error) {
    console.error('Error adding to favorites:', error);
    throw error;
  }
};

export const getFavorites = async (): Promise<Pokemon[]> => {
  try {
    const response = await api.get('/favorites');
    return response.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }
};

export const removeFromFavorites = async (id: number): Promise<void> => {
  try {
    await api.delete(`/favorites/${id}`);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    throw error;
  }
}; 
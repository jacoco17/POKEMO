import { useState, useEffect } from 'react';
import { Pokemon, TeamMember } from '../types/pokemon';
import { getTeam, addToTeam, removeFromTeam } from '../services/api';

export const useTeam = () => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    loadTeam();
  }, [retryCount]);

  const loadTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTeam();
      setTeam(data);
    } catch (err) {
      setError('Failed to load team. Please make sure the json-server is running.');
      console.error('Team loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const addPokemon = async (pokemon: Pokemon) => {
    try {
      if (team.length >= 6) {
        throw new Error('Team is full (max 6 Pokemon)');
      }
      
      if (team.some(p => p.id === pokemon.id)) {
        throw new Error('Pokemon already in team');
      }

      const newTeamMember = await addToTeam(pokemon);
      setTeam([...team, newTeamMember]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add Pokemon to team');
      console.error('Add Pokemon error:', err);
      return false;
    }
  };

  const removePokemon = async (id: number) => {
    try {
      await removeFromTeam(id);
      setTeam(team.filter(p => p.id !== id));
      return true;
    } catch (err) {
      setError('Failed to remove Pokemon from team');
      console.error('Remove Pokemon error:', err);
      return false;
    }
  };

  const retry = () => {
    setRetryCount(prev => prev + 1);
  };

  return {
    team,
    loading,
    error,
    addPokemon,
    removePokemon,
    isTeamFull: team.length >= 6,
    retry
  };
}; 
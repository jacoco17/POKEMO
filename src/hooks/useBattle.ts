import { Pokemon } from '../types/pokemon';
import { saveBattle } from '../services/api';

interface BattleResult {
  winner: Pokemon;
  rounds: {
    stat: string;
    pokemon1Value: number;
    pokemon2Value: number;
    winner: string;
  }[];
}

export const useBattle = () => {
  const simulateBattle = async (pokemon1: Pokemon, pokemon2: Pokemon): Promise<BattleResult> => {
    const rounds = [];
    const stats = ['hp', 'attack', 'speed'];
    let pokemon1Wins = 0;
    let pokemon2Wins = 0;

    for (const stat of stats) {
      const stat1 = pokemon1.stats.find(s => s.stat.name === stat)?.base_stat || 0;
      const stat2 = pokemon2.stats.find(s => s.stat.name === stat)?.base_stat || 0;

      const roundWinner = stat1 > stat2 ? pokemon1.name : pokemon2.name;
      
      rounds.push({
        stat,
        pokemon1Value: stat1,
        pokemon2Value: stat2,
        winner: roundWinner
      });

      if (roundWinner === pokemon1.name) pokemon1Wins++;
      else pokemon2Wins++;
    }

    const winner = pokemon1Wins > pokemon2Wins ? pokemon1 : pokemon2;

    // Save battle result
    await saveBattle({
      pokemon1,
      pokemon2,
      winner,
      date: new Date().toISOString()
    });

    return {
      winner,
      rounds
    };
  };

  return {
    simulateBattle
  };
}; 
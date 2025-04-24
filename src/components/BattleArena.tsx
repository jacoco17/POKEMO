import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress
} from '@mui/material';
import { Pokemon } from '../types/pokemon';
import { useBattle } from '../hooks/useBattle';
import PokemonCard from './PokemonCard';

interface BattleArenaProps {
  pokemon1?: Pokemon;
  pokemon2?: Pokemon;
  onSelectPokemon1?: () => void;
  onSelectPokemon2?: () => void;
}

const BattleArena: React.FC<BattleArenaProps> = ({
  pokemon1,
  pokemon2,
  onSelectPokemon1,
  onSelectPokemon2
}) => {
  const { simulateBattle } = useBattle();
  const [battleResult, setBattleResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleBattle = async () => {
    if (!pokemon1 || !pokemon2) return;
    
    setLoading(true);
    try {
      const result = await simulateBattle(pokemon1, pokemon2);
      setBattleResult(result);
    } catch (error) {
      console.error('Battle error:', error);
    }
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom align="center">
        Battle Arena
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 4 }}>
        <Box sx={{ width: 345 }}>
          {pokemon1 ? (
            <PokemonCard pokemon={pokemon1} showActions={false} />
          ) : (
            <Paper 
              sx={{ 
                height: 400, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Button variant="contained" onClick={onSelectPokemon1}>
                Select Pokemon 1
              </Button>
            </Paper>
          )}
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          mx: 2 
        }}>
          <Typography variant="h5" sx={{ mb: 2 }}>VS</Typography>
          {pokemon1 && pokemon2 && (
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleBattle}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Start Battle'}
            </Button>
          )}
        </Box>

        <Box sx={{ width: 345 }}>
          {pokemon2 ? (
            <PokemonCard pokemon={pokemon2} showActions={false} />
          ) : (
            <Paper 
              sx={{ 
                height: 400, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <Button variant="contained" onClick={onSelectPokemon2}>
                Select Pokemon 2
              </Button>
            </Paper>
          )}
        </Box>
      </Box>

      {battleResult && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
            Battle Results
          </Typography>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Stat</TableCell>
                  <TableCell align="right">{pokemon1?.name}</TableCell>
                  <TableCell align="right">{pokemon2?.name}</TableCell>
                  <TableCell align="right">Winner</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {battleResult.rounds.map((round: any) => (
                  <TableRow key={round.stat}>
                    <TableCell component="th" scope="row" sx={{ textTransform: 'capitalize' }}>
                      {round.stat}
                    </TableCell>
                    <TableCell align="right">{round.pokemon1Value}</TableCell>
                    <TableCell align="right">{round.pokemon2Value}</TableCell>
                    <TableCell 
                      align="right"
                      sx={{ 
                        color: 'success.main',
                        textTransform: 'capitalize'
                      }}
                    >
                      {round.winner}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Typography variant="h6" align="center" sx={{ mt: 3 }}>
            Winner: <span style={{ color: '#2e7d32', textTransform: 'capitalize' }}>{battleResult.winner.name}</span>
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default BattleArena; 
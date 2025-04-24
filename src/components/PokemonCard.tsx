import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
  onAddToTeam?: () => void;
  onRemoveFromTeam?: () => void;
  isInTeam?: boolean;
  showActions?: boolean;
  onClick?: () => void;
}

const PokemonCard: React.FC<PokemonCardProps> = ({
  pokemon,
  onAddToTeam,
  onRemoveFromTeam,
  isInTeam = false,
  showActions = true,
  onClick
}) => {
  const typeColors: Record<string, string> = {
    normal: '#A8A878',
    fire: '#F08030',
    water: '#6890F0',
    electric: '#F8D030',
    grass: '#78C850',
    ice: '#98D8D8',
    fighting: '#C03028',
    poison: '#A040A0',
    ground: '#E0C068',
    flying: '#A890F0',
    psychic: '#F85888',
    bug: '#A8B820',
    rock: '#B8A038',
    ghost: '#705898',
    dragon: '#7038F8',
    dark: '#705848',
    steel: '#B8B8D0',
    fairy: '#EE99AC'
  };

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { transform: 'scale(1.02)' } : {}
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height="200"
        image={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
        alt={pokemon.name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div" sx={{ textTransform: 'capitalize' }}>
          {pokemon.name}
        </Typography>
        
        <Stack direction="row" spacing={1} mb={2}>
          {pokemon.types.map(({ type }) => (
            <Chip
              key={type.name}
              label={type.name}
              size="small"
              sx={{
                bgcolor: typeColors[type.name] || '#777',
                color: 'white',
                textTransform: 'capitalize'
              }}
            />
          ))}
        </Stack>

        <Box sx={{ mb: 2 }}>
          {pokemon.stats.map(({ base_stat, stat }) => (
            <Box key={stat.name} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                {stat.name}:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {base_stat}
              </Typography>
            </Box>
          ))}
        </Box>

        {showActions && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {isInTeam ? (
              <Button 
                size="small" 
                color="error" 
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFromTeam?.();
                }}
              >
                Remove from Team
              </Button>
            ) : (
              <Button 
                size="small" 
                color="primary" 
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToTeam?.();
                }}
              >
                Add to Team
              </Button>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default PokemonCard; 
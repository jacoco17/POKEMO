import React, { useState } from 'react';
import {
  Container,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  TextField,
  Box,
  CircularProgress
} from '@mui/material';
import { getPokemonByNameOrId } from '../services/api';
import BattleArena from '../components/BattleArena';
import PokemonCard from '../components/PokemonCard';
import { Pokemon } from '../types/pokemon';

const Battle: React.FC = () => {
  const [selectedPokemon1, setSelectedPokemon1] = useState<Pokemon | null>(null);
  const [selectedPokemon2, setSelectedPokemon2] = useState<Pokemon | null>(null);
  const [isSelectingPokemon1, setIsSelectingPokemon1] = useState(false);
  const [isSelectingPokemon2, setIsSelectingPokemon2] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm) return;

    setLoading(true);
    setError(null);
    try {
      const pokemon = await getPokemonByNameOrId(searchTerm.toLowerCase());
      setSearchResults([pokemon]);
    } catch (err) {
      setError('Pokemon not found');
      setSearchResults([]);
    }
    setLoading(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (!event.target.value) {
      setSearchResults([]);
    }
  };

  const handleSearchKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSelectPokemon = (pokemon: Pokemon) => {
    if (isSelectingPokemon1) {
      setSelectedPokemon1(pokemon);
      setIsSelectingPokemon1(false);
    } else if (isSelectingPokemon2) {
      setSelectedPokemon2(pokemon);
      setIsSelectingPokemon2(false);
    }
    setSearchTerm('');
    setSearchResults([]);
  };

  const SelectPokemonDialog = () => (
    <Dialog 
      open={isSelectingPokemon1 || isSelectingPokemon2} 
      onClose={() => {
        setIsSelectingPokemon1(false);
        setIsSelectingPokemon2(false);
        setSearchTerm('');
        setSearchResults([]);
      }}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Select Pokemon {isSelectingPokemon1 ? '1' : '2'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 3, mt: 1 }}>
          <TextField
            fullWidth
            label="Search Pokemon"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearchChange}
            onKeyPress={handleSearchKeyPress}
            placeholder="Enter Pokemon name or ID and press Enter"
          />
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        <Grid container spacing={2}>
          {searchResults.map((pokemon) => (
            <Grid item xs={12} sm={6} md={4} key={pokemon.id}>
              <PokemonCard
                pokemon={pokemon}
                showActions={false}
                onClick={() => handleSelectPokemon(pokemon)}
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
    </Dialog>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Pokemon Battle
      </Typography>

      <BattleArena
        pokemon1={selectedPokemon1 || undefined}
        pokemon2={selectedPokemon2 || undefined}
        onSelectPokemon1={() => setIsSelectingPokemon1(true)}
        onSelectPokemon2={() => setIsSelectingPokemon2(true)}
      />

      <SelectPokemonDialog />
    </Container>
  );
};

export default Battle; 
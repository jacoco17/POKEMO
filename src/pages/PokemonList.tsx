import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  TextField,
  Pagination,
  CircularProgress,
  Container,
  Typography,
  Alert
} from '@mui/material';
import { getPokemonList, getPokemonByNameOrId } from '../services/api';
import PokemonCard from '../components/PokemonCard';
import { useTeam } from '../hooks/useTeam';
import { Pokemon } from '../types/pokemon';

const PokemonList: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const { team, addPokemon, removePokemon, error: teamError } = useTeam();

  const ITEMS_PER_PAGE = 20;

  useEffect(() => {
    if (searchTerm) {
      searchPokemon();
    } else {
      loadPokemons();
    }
  }, [page, searchTerm]);

  const loadPokemons = async () => {
    setLoading(true);
    setError(null);
    try {
      const offset = (page - 1) * ITEMS_PER_PAGE;
      const data = await getPokemonList(offset, ITEMS_PER_PAGE);
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      
      const pokemonDetails = await Promise.all(
        data.results.map((pokemon: { name: string }) => 
          getPokemonByNameOrId(pokemon.name)
        )
      );
      
      setPokemons(pokemonDetails);
    } catch (err) {
      setError('Failed to load Pokemon list');
    }
    setLoading(false);
  };

  const searchPokemon = async () => {
    if (!searchTerm) return;
    
    setLoading(true);
    setError(null);
    try {
      const pokemon = await getPokemonByNameOrId(searchTerm.toLowerCase());
      setPokemons([pokemon]);
      setTotalPages(1);
    } catch (err) {
      setError('Pokemon not found');
      setPokemons([]);
    }
    setLoading(false);
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Pokemon List
      </Typography>

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          label="Search Pokemon"
          variant="outlined"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Enter Pokemon name or ID"
        />
      </Box>

      {(error || teamError) && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || teamError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3}>
            {pokemons.map((pokemon) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                <PokemonCard
                  pokemon={pokemon}
                  isInTeam={team.some(p => p.id === pokemon.id)}
                  onAddToTeam={() => addPokemon(pokemon)}
                  onRemoveFromTeam={() => removePokemon(pokemon.id)}
                />
              </Grid>
            ))}
          </Grid>

          {!searchTerm && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default PokemonList; 
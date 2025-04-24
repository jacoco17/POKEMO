import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Pagination,
  useTheme,
  useMediaQuery,
  Paper,
  InputBase,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PokemonCard from './PokemonCard';
import { useTeam } from '../hooks/useTeam';
import { Pokemon } from '../types/pokemon';
import { useFavorites } from '../hooks/useFavorites';

const ITEMS_PER_PAGE = 12;

const PokemonList: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { team, addToTeam, removeFromTeam } = useTeam();
  const { favorites, addToFavorite, removeFromFavorite } = useFavorites();
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [types, setTypes] = useState<string[]>([]);

  useEffect(() => {
    const fetchPokemonTypes = async () => {
      try {
        const response = await fetch('https://pokeapi.co/api/v2/type');
        const data = await response.json();
        setTypes(data.results.map((type: any) => type.name));
      } catch (error) {
        console.error('Error fetching types:', error);
      }
    };

    fetchPokemonTypes();
  }, []);

  useEffect(() => {
    const fetchPokemons = async () => {
      setLoading(true);
      setError(null);
      try {
        const offset = (page - 1) * ITEMS_PER_PAGE;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`);
        const data = await response.json();
        
        const pokemonDetails = await Promise.all(
          data.results.map(async (pokemon: any) => {
            const response = await fetch(pokemon.url);
            return response.json();
          })
        );

        setPokemons(pokemonDetails);
        setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));
      } catch (error) {
        setError('Failed to fetch Pokémon data');
        console.error('Error fetching Pokémon:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPokemons();
  }, [page]);

  const filteredPokemons = pokemons.filter(pokemon => {
    const matchesSearch = pokemon.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || pokemon.types.some(type => type.type.name === typeFilter);
    return matchesSearch && matchesType;
  });

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTypeFilterChange = (event: any) => {
    setTypeFilter(event.target.value);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Typography 
        variant="h4" 
        gutterBottom 
        align="center" 
        sx={{ 
          mb: 4,
          color: theme.palette.primary.main,
          fontWeight: 700,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        Pokémon List
      </Typography>

      <Box sx={{ 
        display: 'flex', 
        flexDirection: { xs: 'column', md: 'row' },
        gap: 2,
        mb: 4,
        alignItems: { xs: 'stretch', md: 'center' }
      }}>
        <Paper
          component="form"
          sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            flex: 1,
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Pokémon..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
            <SearchIcon />
          </IconButton>
        </Paper>

        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={typeFilter}
            onChange={handleTypeFilterChange}
            label="Type"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            {types.map((type) => (
              <MenuItem key={type} value={type} sx={{ textTransform: 'capitalize' }}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {filteredPokemons.map((pokemon) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
            <PokemonCard
              pokemon={pokemon}
              onAddToTeam={() => addToTeam(pokemon)}
              onRemoveFromTeam={() => removeFromTeam(pokemon.id)}
              isInTeam={team.some(p => p.id === pokemon.id)}
              isFavorite={favorites.some(f => f.id === pokemon.id)}
              onToggleFavorite={() => {
                if (favorites.some(f => f.id === pokemon.id)) {
                  removeFromFavorite(pokemon.id);
                } else {
                  addToFavorite(pokemon);
                }
              }}
            />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, mb: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
          size={isMobile ? "small" : "medium"}
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: 1,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default PokemonList; 
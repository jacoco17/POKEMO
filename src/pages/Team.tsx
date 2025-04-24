import React from 'react';
import {
  Container,
  Typography,
  Grid,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import PokemonCard from '../components/PokemonCard';
import { useTeam } from '../hooks/useTeam';

const Team: React.FC = () => {
  const { team, loading, error, removePokemon } = useTeam();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        My Team
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {team.length === 0 ? (
            <Alert severity="info">
              Your team is empty. Go to the Pokemon List to add Pokemon to your team!
            </Alert>
          ) : (
            <Grid container spacing={3}>
              {team.map((pokemon) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={pokemon.id}>
                  <PokemonCard
                    pokemon={pokemon}
                    isInTeam={true}
                    onRemoveFromTeam={() => removePokemon(pokemon.id)}
                  />
                </Grid>
              ))}
              {Array.from({ length: Math.max(0, 6 - team.length) }).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={`empty-${index}`}>
                  <Box
                    sx={{
                      height: '100%',
                      minHeight: 400,
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Typography color="text.secondary">
                      Empty Slot ({team.length}/6)
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}
    </Container>
  );
};

export default Team; 
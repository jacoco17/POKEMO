import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  CssBaseline,
  ThemeProvider,
  createTheme
} from '@mui/material';
import PokemonList from './pages/PokemonList';
import Team from './pages/Team';
import Battle from './pages/Battle';

const theme = createTheme({
  palette: {
    primary: {
      main: '#EF5350',
    },
    secondary: {
      main: '#42A5F5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                PokéJac
              </Typography>
              <Button color="inherit" component={Link} to="/">
                Pokemon List
              </Button>
              <Button color="inherit" component={Link} to="/team">
                My Team
              </Button>
              <Button color="inherit" component={Link} to="/battle">
                Battle
              </Button>
            </Toolbar>
          </AppBar>

          <Container>
            <Routes>
              <Route path="/" element={<PokemonList />} />
              <Route path="/team" element={<Team />} />
              <Route path="/battle" element={<Battle />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App; 
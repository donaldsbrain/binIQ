import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, CssBaseline, ThemeProvider, createTheme, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { Outlet, Link } from 'react-router-dom';

const Layout: React.FC = () => {
  const [darkMode, setDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
    components: {
      MuiContainer: {
        styleOverrides: {
          root: {
            "&.MuiContainer-lg": {
              maxWidth: '100%'
            }
          }
        }
      }
    }
  });

  const handleThemeChange = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
              Bin IQ
            </Link>
          </Typography>
          <nav>
            <Link to="/" style={{ color: 'inherit', marginRight: '16px', textDecoration: 'none' }}>
              Home
            </Link>
            <Link to="/bin-layout" style={{ color: 'inherit', textDecoration: 'none' }}>
              Layouts
            </Link>
          </nav>
          <IconButton color="inherit" onClick={handleThemeChange}>
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth={false} id="DONALD2"
      sx={{
        width: "100%", // Full width
      }}>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
};

export default Layout;
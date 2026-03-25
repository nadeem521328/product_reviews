import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ThemeProviderWrapper, useThemeContext } from './contexts/ThemeContext';
import { getTheme } from './theme';
import Home from './pages/Home';
import Search from './pages/Search';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import './App.css';

function InnerApp() {
  const { mode } = useThemeContext();
  const theme = getTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

function App() {
  return (
    <ThemeProviderWrapper>
      <InnerApp />
    </ThemeProviderWrapper>
  );
}

export default App;

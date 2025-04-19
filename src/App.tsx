import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import TopTenPage from './pages/TopTenPage';
import Navbar from './components/Navbar';
import { BookProvider } from './context/BookContext';

function App() {
  const { theme } = useTheme();

  // Apply theme class to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <BookProvider>
        <Router>
          <Navbar />
          <main className="container mx-auto px-4 py-8 max-w-7xl">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/top-ten" element={<TopTenPage />} />
            </Routes>
          </main>
        </Router>
      </BookProvider>
    </div>
  );
}

export default App;
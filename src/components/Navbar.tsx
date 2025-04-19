import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <nav className={`sticky top-0 z-10 ${
      theme === 'dark' ? 'bg-gray-800 shadow-lg' : 'bg-white shadow-md'
    } transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <BookOpen className="h-6 w-6 text-primary-500" />
          <span className="text-xl font-bold">BookShelf</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              location.pathname === '/' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span>My Books</span>
          </Link>
          
          <Link 
            to="/top-ten" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
              location.pathname === '/top-ten' 
                ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-300' 
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }`}
          >
            <Award className="h-5 w-5" />
            <span>Top 10</span>
          </Link>
          
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-yellow-300" />
            ) : (
              <Moon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
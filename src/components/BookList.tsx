import { useState, useMemo } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from './BookCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { BookCategory } from '../types';

const CATEGORIES: BookCategory[] = ['Sci-fi', 'Erotic', 'Adventure', 'Horror', 'Science', 'History'];

const BookList: React.FC = () => {
  const { books } = useBooks();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<BookCategory[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Search filter
      const matchesSearch = searchTerm === '' || 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(book.category);
      
      // Rating filter
      const matchesRating = book.rating >= ratingFilter;
      
      return matchesSearch && matchesCategory && matchesRating;
    });
  }, [books, searchTerm, selectedCategories, ratingFilter]);
  
  const toggleCategory = (category: BookCategory) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategories([]);
    setRatingFilter(0);
  };
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          <SlidersHorizontal className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </button>
      </div>
      
      {showFilters && (
        <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-slide-up">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Filter Books</h3>
            <button 
              onClick={clearFilters}
              className="text-sm text-primary-500 hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear all filters
            </button>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Categories</h4>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => toggleCategory(category)}
                  className={`px-3 py-1 text-sm rounded-full transition-colors ${
                    selectedCategories.includes(category)
                      ? 'bg-primary-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Minimum Rating: {ratingFilter}</h4>
            <input
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={ratingFilter}
              onChange={(e) => setRatingFilter(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-2">No books found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            Try adjusting your filters or add some books to your collection
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookList;
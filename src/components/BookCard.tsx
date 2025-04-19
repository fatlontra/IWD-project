import { Book } from '../types';
import { Star, Edit, Trash2 } from 'lucide-react';
import { useBooks } from '../context/BookContext';
import { useState } from 'react';
import BookEditForm from './BookEditForm';

// Default placeholder covers for each category
const CATEGORY_IMAGES = {
  'Sci-fi': 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Erotic': 'https://images.pexels.com/photos/5560516/pexels-photo-5560516.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Adventure': 'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Horror': 'https://images.pexels.com/photos/3391930/pexels-photo-3391930.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'Science': 'https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  'History': 'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

// Color accents for each category
const CATEGORY_COLORS = {
  'Sci-fi': 'from-blue-500 to-indigo-600',
  'Erotic': 'from-pink-500 to-rose-600',
  'Adventure': 'from-amber-500 to-orange-600',
  'Horror': 'from-red-600 to-red-900',
  'Science': 'from-green-500 to-teal-600',
  'History': 'from-yellow-500 to-amber-600'
};

interface BookCardProps {
  book: Book;
  isDraggable?: boolean;
  dragHandleProps?: any;
}

const BookCard: React.FC<BookCardProps> = ({ book, isDraggable, dragHandleProps }) => {
  const { deleteBook } = useBooks();
  const [isEditing, setIsEditing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const coverImage = book.coverUrl || CATEGORY_IMAGES[book.category];
  const gradientColor = CATEGORY_COLORS[book.category];
  
  if (isEditing) {
    return <BookEditForm book={book} onCancel={() => setIsEditing(false)} />;
  }
  
  return (
    <div 
      className={`relative rounded-lg shadow-md overflow-hidden transition-all duration-300 h-full 
        ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}
        hover:shadow-lg dark:bg-gray-800 bg-white animate-fade-in`}
      {...dragHandleProps}
    >
      <div className="relative">
        <div className={`absolute inset-0 bg-gradient-to-t ${gradientColor} opacity-60`} />
        <img 
          src={coverImage} 
          alt={`Cover for ${book.title}`}
          className="w-full h-40 object-cover"
          onError={(e) => {
            // Fallback to category image if provided URL fails
            (e.target as HTMLImageElement).src = CATEGORY_IMAGES[book.category];
          }}
        />
        <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs font-semibold">
          {book.category}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-1" title={book.title}>{book.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">by {book.author}</p>
        
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${
                  i < Math.round(book.rating / 2) 
                    ? 'text-yellow-400 fill-yellow-400' 
                    : 'text-gray-300'
                }`} 
              />
            ))}
          </div>
          <span className="text-sm font-medium">{book.rating}/10</span>
        </div>
        
        <div className="flex mt-3 space-x-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Edit book"
          >
            <Edit className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </button>
          <button
            onClick={() => deleteBook(book.id)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Delete book"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="ml-auto text-xs px-2 py-1 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {showDetails ? "Hide details" : "Show details"}
          </button>
        </div>
        
        {showDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 animate-slide-up">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Added on {new Date(book.dateAdded).toLocaleDateString()}
            </p>
            <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-sm">
              <p className="italic">"{book.title}" is a {book.category.toLowerCase()} book written by {book.author}.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookCard;
import { useState } from 'react';
import { Book, BookCategory } from '../types';
import { useBooks } from '../context/BookContext';
import { X } from 'lucide-react';

const CATEGORIES: BookCategory[] = ['Sci-fi', 'Erotic', 'Adventure', 'Horror', 'Science', 'History'];

interface BookEditFormProps {
  book: Book;
  onCancel: () => void;
}

const BookEditForm: React.FC<BookEditFormProps> = ({ book, onCancel }) => {
  const { updateBook } = useBooks();
  const [formData, setFormData] = useState({
    title: book.title,
    author: book.author,
    category: book.category,
    rating: book.rating,
    coverUrl: book.coverUrl || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? Number(value) : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    updateBook({
      ...book,
      title: formData.title,
      author: formData.author,
      category: formData.category,
      rating: formData.rating,
      coverUrl: formData.coverUrl || undefined,
    });
    
    onCancel();
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Edit Book</h2>
        <button 
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium mb-1">
            Book Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-title"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label htmlFor="edit-author" className="block text-sm font-medium mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="edit-author"
            name="author"
            required
            value={formData.author}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          />
        </div>
        
        <div>
          <label htmlFor="edit-category" className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            id="edit-category"
            name="category"
            required
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
          >
            {CATEGORIES.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="edit-rating" className="block text-sm font-medium mb-1">
            Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center">
            <input
              type="range"
              id="edit-rating"
              name="rating"
              min="0"
              max="10"
              step="0.5"
              required
              value={formData.rating}
              onChange={handleChange}
              className="w-full mr-4"
            />
            <span className="text-lg font-medium w-10 text-center">
              {formData.rating}
            </span>
          </div>
        </div>
        
        <div>
          <label htmlFor="edit-coverUrl" className="block text-sm font-medium mb-1">
            Cover URL (Optional)
          </label>
          <input
            type="url"
            id="edit-coverUrl"
            name="coverUrl"
            value={formData.coverUrl}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            placeholder="https://example.com/book-cover.jpg"
          />
        </div>
        
        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 mr-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-md transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookEditForm;
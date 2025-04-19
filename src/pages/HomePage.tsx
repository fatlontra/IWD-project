import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import { useBooks } from '../context/BookContext';

const HomePage: React.FC = () => {
  const { books } = useBooks();
  
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Book Collection</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track, rate, and manage your reading journey
        </p>
        {books.length > 0 && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
            You have {books.length} book{books.length !== 1 ? 's' : ''} in your collection
          </p>
        )}
      </div>
      
      <BookForm />
      <BookList />
    </div>
  );
};

export default HomePage;
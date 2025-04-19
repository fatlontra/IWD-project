import React, { createContext, useState, useContext, useEffect } from 'react';
import { Book, BookContextType } from '../types';

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [books, setBooks] = useState<Book[]>(() => {
    const savedBooks = localStorage.getItem('books');
    return savedBooks ? JSON.parse(savedBooks) : [];
  });

  const [topTenBooks, setTopTenBooks] = useState<Book[]>(() => {
    const savedTopTen = localStorage.getItem('topTenBooks');
    return savedTopTen ? JSON.parse(savedTopTen) : [];
  });

  useEffect(() => {
    localStorage.setItem('books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('topTenBooks', JSON.stringify(topTenBooks));
  }, [topTenBooks]);

  const addBook = (book: Omit<Book, 'id' | 'dateAdded'>) => {
    const newBook: Book = {
      ...book,
      id: crypto.randomUUID(),
      dateAdded: new Date().toISOString(),
    };
    setBooks(prevBooks => [...prevBooks, newBook]);
  };

  const updateBook = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => book.id === updatedBook.id ? updatedBook : book)
    );
    
    // Also update the book in top ten if it exists there
    if (topTenBooks.some(book => book.id === updatedBook.id)) {
      setTopTenBooks(prevTopTen =>
        prevTopTen.map(book => book.id === updatedBook.id ? updatedBook : book)
      );
    }
  };

  const deleteBook = (id: string) => {
    setBooks(prevBooks => prevBooks.filter(book => book.id !== id));
    setTopTenBooks(prevTopTen => prevTopTen.filter(book => book.id !== id));
  };

  const updateTopTen = (updatedTopTen: Book[]) => {
    // Ensure we only ever have 10 books maximum in the top ten
    setTopTenBooks(updatedTopTen.slice(0, 10));
  };

  return (
    <BookContext.Provider value={{ 
      books, 
      addBook, 
      updateBook, 
      deleteBook, 
      topTenBooks, 
      updateTopTen 
    }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (context === undefined) {
    throw new Error('useBooks must be used within a BookProvider');
  }
  return context;
};
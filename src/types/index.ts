export type BookCategory = 'Sci-fi' | 'Erotic' | 'Adventure' | 'Horror' | 'Science' | 'History';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  rating: number;
  dateAdded: string;
  coverUrl?: string;
}

export interface BookContextType {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'dateAdded'>) => void;
  updateBook: (book: Book) => void;
  deleteBook: (id: string) => void;
  topTenBooks: Book[];
  updateTopTen: (books: Book[]) => void;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
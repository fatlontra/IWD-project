import { useState } from 'react';
import { useBooks } from '../context/BookContext';
import BookCard from '../components/BookCard';
import DraggableBookItem from '../components/DraggableBookItem';
import { Book } from '../types';
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Trophy, ArrowLeftRight, ChevronDown, ChevronUp } from 'lucide-react';

const TopTenPage: React.FC = () => {
  const { books, topTenBooks, updateTopTen } = useBooks();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [container, setContainer] = useState<'top-ten' | 'available'>('top-ten');

  // Get available books (those not in top ten)
  const availableBooks = books.filter(
    book => !topTenBooks.some(topBook => topBook.id === book.id)
  );

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    // Set the container where the drag started
    if (topTenBooks.some(book => book.id === event.active.id)) {
      setContainer('top-ten');
    } else {
      setContainer('available');
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    // Check if dragging between containers and handle accordingly
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Find which container the over ID belongs to
    const isActiveInTopTen = topTenBooks.some(book => book.id === activeId);
    const isOverInTopTen = topTenBooks.some(book => book.id === overId);
    
    if (isActiveInTopTen !== isOverInTopTen) {
      // If containers are different, update the container state
      setContainer(isOverInTopTen ? 'top-ten' : 'available');
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }
    
    const activeId = active.id as string;
    const overId = over.id as string;
    
    // Find the active book
    const activeBook = [...topTenBooks, ...availableBooks].find(
      book => book.id === activeId
    );
    
    if (!activeBook) {
      setActiveId(null);
      return;
    }
    
    // Check if dragging between containers or within the same container
    const isActiveInTopTen = topTenBooks.some(book => book.id === activeId);
    const isOverInTopTen = topTenBooks.some(book => book.id === overId);
    
    if (isActiveInTopTen && isOverInTopTen) {
      // Reordering within top ten
      const oldIndex = topTenBooks.findIndex(book => book.id === activeId);
      const newIndex = topTenBooks.findIndex(book => book.id === overId);
      
      if (oldIndex !== newIndex) {
        const newTopTen = arrayMove(topTenBooks, oldIndex, newIndex);
        updateTopTen(newTopTen);
      }
    } else if (!isActiveInTopTen && isOverInTopTen) {
      // Moving from available to top ten
      if (topTenBooks.length < 10) {
        // Find position in top ten
        const newIndex = topTenBooks.findIndex(book => book.id === overId);
        const newTopTen = [...topTenBooks];
        newTopTen.splice(newIndex, 0, activeBook);
        updateTopTen(newTopTen);
      }
    } else if (isActiveInTopTen && !isOverInTopTen) {
      // Moving from top ten to available
      const newTopTen = topTenBooks.filter(book => book.id !== activeId);
      updateTopTen(newTopTen);
    }
    
    setActiveId(null);
  };

  // Find the active book for the drag overlay
  const activeBook = activeId ? [...topTenBooks, ...availableBooks].find(
    book => book.id === activeId
  ) : null;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center">
          <Trophy className="mr-2 h-7 w-7 text-yellow-500" />
          My Top 10 Books
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Arrange your favorite books in order of preference
        </p>
        
        <div className="bg-primary-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowInstructions(!showInstructions)}
          >
            <h3 className="font-medium flex items-center">
              <ArrowLeftRight className="mr-2 h-5 w-5 text-primary-500" />
              How to organize your top 10
            </h3>
            <button className="text-gray-500">
              {showInstructions ? <ChevronUp /> : <ChevronDown />}
            </button>
          </div>
          
          {showInstructions && (
            <div className="mt-3 text-sm text-gray-600 dark:text-gray-400 animate-slide-up">
              <ol className="list-decimal pl-5 space-y-2">
                <li>Drag books from your collection on the right side to your Top 10 on the left side</li>
                <li>Rearrange books within your Top 10 by dragging them up or down</li>
                <li>Remove books from your Top 10 by dragging them back to your collection</li>
                <li>Your Top 10 list is automatically saved</li>
              </ol>
            </div>
          )}
        </div>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top 10 List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="mr-2 h-5 w-5 text-yellow-500" />
              Top 10 Books
            </h2>
            
            <SortableContext 
              items={topTenBooks.map(book => book.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {topTenBooks.length === 0 ? (
                  <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      Your top 10 list is empty
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Drag books from the right to create your ranking
                    </p>
                  </div>
                ) : (
                  topTenBooks.map((book, index) => (
                    <div key={book.id} className="relative">
                      <div className="absolute -left-6 top-1/2 transform -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <DraggableBookItem book={book} id={book.id} />
                    </div>
                  ))
                )}
              </div>
            </SortableContext>
          </div>
          
          {/* Available Books */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Collection</h2>
            
            <SortableContext 
              items={availableBooks.map(book => book.id)} 
              strategy={horizontalListSortingStrategy}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableBooks.length === 0 ? (
                  <div className="col-span-2 text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                    <p className="text-gray-500 dark:text-gray-400">
                      No books available
                    </p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                      Add some books on the home page
                    </p>
                  </div>
                ) : (
                  availableBooks.map(book => (
                    <DraggableBookItem key={book.id} book={book} id={book.id} />
                  ))
                )}
              </div>
            </SortableContext>
          </div>
        </div>
        
        <DragOverlay>
          {activeBook ? (
            <div className="opacity-80 w-72">
              <BookCard book={activeBook} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TopTenPage;
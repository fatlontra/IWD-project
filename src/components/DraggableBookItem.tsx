import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Book } from '../types';
import BookCard from './BookCard';

interface DraggableBookItemProps {
  book: Book;
  id: string;
}

const DraggableBookItem: React.FC<DraggableBookItemProps> = ({ book, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`${isDragging ? 'z-10' : ''}`}
    >
      <BookCard 
        book={book} 
        isDraggable={true}
        dragHandleProps={{
          ...attributes,
          ...listeners,
        }}
      />
    </div>
  );
};

export default DraggableBookItem;
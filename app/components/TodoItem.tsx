// app/components/TodoItem.tsx

import React from 'react';

interface TodoItemProps {
  id: number;
  title: string; 
  completed: boolean;
  onToggleCompleted: (id: number) => Promise<void>; 
  onDelete: (id: number) => Promise<void>; 
}

const TodoItem: React.FC<TodoItemProps> = ({ id, title, completed, onToggleCompleted, onDelete }) => { 
  const handleToggleCompleted = async () => {
    try {
      await onToggleCompleted(id);
    } catch (error) {
      console.error("Error toggling todo completed status:", error);
      // エラー処理を追加 (必要に応じて)
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error("Error deleting todo:", error);
      // エラー処理を追加 (必要に応じて)
    }
  }

  return (
    <li>
      <input 
        type="checkbox" 
        checked={completed} 
        onChange={handleToggleCompleted} 
      />
      <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{title}</span> 
      <button onClick={handleDelete}>削除</button>
    </li>
  );
};

export default TodoItem;
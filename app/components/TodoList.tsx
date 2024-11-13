// app/components/TodoList.tsx
'use client';
import React from 'react';
import TodoItem from './TodoItem';
import supabase from '../../utils/supabase';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  start_date: string | null; // 開始日付（オプション）
  end_date: string | null;   // 終了日付（オプション）
  status: string | null;     // ステータス（オプション）
  description: string | null; // 説明文（オプション）
  image_name: string | null;
}

interface TodoListProps {
  todos: Todo[];
  onToggleCompleted: (id: number) => Promise<void>; 
  onDelete: (id: number) => Promise<void>; 
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggleCompleted, onDelete }) => {
  return (
    <ul>
      {todos.map((todo) => ( 
        <TodoItem 
          key={todo.id}
          // スプレッド構文を使用して、todo の全てのプロパティを TodoItem に渡す
          {...todo} 
          {...todo.image_name && (
            <img 
              src={supabase.storage.from('pics').getPublicUrl(`pics_folder/${todo.image_name}`).data.publicUrl} 
              alt={todo.title} 
            />
          )}
          onToggleCompleted={onToggleCompleted} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
};

export default TodoList;

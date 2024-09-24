// app/components/TodoList.tsx
'use client';
import React from 'react';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
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
          id={todo.id}
          title={todo.title}
          completed={todo.completed}
          onToggleCompleted={onToggleCompleted} 
          onDelete={onDelete} 
        />
      ))}
    </ul>
  );
};

export default TodoList;
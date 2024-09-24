// app/components/AddTodoForm.tsx
'use client';
import React, { useState } from 'react';

interface AddTodoFormProps {
  onAddTodo: (newTitle: string) => void; 
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '') return; 
    onAddTodo(title);
    setTitle(''); 
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="新しい ToDo を入力..." 
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTodoForm;
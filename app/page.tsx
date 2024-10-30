// page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import supabase from '../utils/supabase';
import type { PutBlobResult } from '@vercel/blob';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  start_date: string | null; 
  end_date: string | null;
  status: string | null;
  description: string | null;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pics
  const inputFileRef = useRef<HTMLInputElement>(null);
  // const [blob, setBlob] = useState<PutBlobResult | null>(null);
  // const [filename, setFilename] = useState('');
  const [blobs, setBlobs] = useState<PutBlobResult[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        // Supabase から Todo 一覧を取得 (テーブル名を new_todo に変更)
        const { data, error } = await supabase
          .from('new_todo') 
          .select('*')
          .order('id', { ascending: true }); 

        if (error) {
          throw error;
        }

        setTodos(data as Todo[]); 
      } catch (error) {
        console.error('Error fetching todos:', error);
        setError('Todo の取得に失敗しました。');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodos();
  }, []);

  const handleAddTodo = async (newTodo: Todo) => { 
    try {
      // Supabase に新しい Todo を追加 (テーブル名を new_todo に変更)
      const { data, error } = await supabase
        .from('new_todo') 
        .insert([newTodo]) 
        .select() 
        .single(); 

      if (error) {
        throw error;
      }
      console.log("追加された Todo:", data);
      setTodos([...todos, data as Todo]); 
    } catch (error) {
      console.error('Error adding todo:', error);
      setError('Todo の追加に失敗しました。');
      console.log("追加された Todo:", newTodo);
    }
  };

  const handleToggleCompleted = async (id: number) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id);
      if (!todoToUpdate) return;

      const updatedTodo = { ...todoToUpdate, completed: !todoToUpdate.completed };

      // Supabase で Todo を更新 (テーブル名を new_todo に変更)
      const { error } = await supabase
        .from('new_todo') 
        .update({ completed: updatedTodo.completed })
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos(todos.map(todo => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('Error updating todo:', error);
      setError('Todo の更新に失敗しました。');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      // Supabase から Todo を削除 (テーブル名を new_todo に変更)
      const { error } = await supabase
        .from('new_todo') 
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
      setError('Todo の削除に失敗しました。');
    }
  };

  const handleDelete = async (blobToDelete: PutBlobResult) => {
    try {
      const response = await fetch(`/api/pics?filename=${blobToDelete.pathname.split('/').pop()}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const message = `Error: ${response.status} ${response.statusText}`;
        throw new Error(message);
      }
      console.log('File deleted successfully');
      // Blobのリストから削除したBlobを削除
      setBlobs(blobs.filter((blob) => blob.pathname !== blobToDelete.pathname));
    } catch (error) {
      console.error(error);
    }
  };

  

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (isLoading) {
    return <div>ロード中...</div>;
  }

  return (
    <div>
      <h1>Todo リスト</h1>
      <AddTodoForm onAddTodo={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggleCompleted={handleToggleCompleted}
        onDelete={handleDeleteTodo}
      />

      <form
        onSubmit={async (event) => {
          event.preventDefault();

          if (!inputFileRef.current?.files) {
            throw new Error('No file selected');
          }

          const file = inputFileRef.current.files[0];

          const response = await fetch(
            `/api/pics?filename=${file.name}`,
            {
              method: 'POST',
              body: file,
            },
          );

          const newBlob = (await response.json()) as PutBlobResult;

          setBlobs([...blobs, newBlob]); // Blobのリストに追加
        }}
      >
        <input name="file" ref={inputFileRef} type="file" required />
        <button type="submit">Upload</button>
      </form>

      {/* Blobのリストを表示 */}
      <h2>Images:</h2>
      <ul>
        {blobs.map((blob) => (
          <li key={blob.pathname}>
            <a href={blob.url}>{blob.url}</a>
            <button onClick={() => handleDelete(blob)}>DELETE</button>
          </li>
        ))}
      </ul>
    </div>
  );
}


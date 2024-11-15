// page.tsx
'use client';
import { useState, useEffect } from 'react';
import AddTodoForm from './components/AddTodoForm';
import TodoList from './components/TodoList';
import supabase from '../utils/supabase';


export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
  start_date: string | null; 
  end_date: string | null;
  status: string | null;
  description: string | null;
  image_name: string | null;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // pics
  const [images, setImages] = useState<{ path: string, preview: string }[]>([]);
  console.log(setImages);


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

    const imageToDelete = images[id];
  
      // Supabase Storageから画像を削除
      const { error } = await supabase.storage
        .from("pics")
        .remove([`${imageToDelete.path}`]);
  
      if (error) {
        console.log('Error deleting image:', error);
        setError('画像の削除に失敗しました。');
        return;
      }

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

  useEffect(() => {
    return () => {
      images.forEach(image => URL.revokeObjectURL(image.preview));
    };
  }, [images]);

  if (error) {
    return <div>エラー: {error}</div>;
  }

  if (isLoading) {
    return <div>ロード中...</div>;
  }

  return (
    <div> 
      <div> 
        <h1>Todo リスト</h1>
        <AddTodoForm onAddTodo={handleAddTodo} />  
          {/* <label htmlFor="file-upload"> 
            <span>アップロード</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              accept="image/png, image/jpeg"
              onChange={(e) => {handleUploadStorage(e.target?.files)}}
              multiple
              aria-label="画像を選択" 
            />
          </label> */}
        <TodoList todos={todos} onToggleCompleted={handleToggleCompleted} onDelete={handleDeleteTodo} />
      </div>
    </div>
  );
}

{/* <h2>Images:</h2>
<label htmlFor="file-upload"> 
  <span>アップロード</span>
  <input
    id="file-upload"
    name="file-upload"
    type="file"
    className="sr-only"
    accept="image/png, image/jpeg"
    onChange={(e) => {handleUploadStorage(e.target?.files)}}
    multiple
    aria-label="画像を選択" 
  />
</label>
<div className="image-list"> 
  {images.map((image, index) => (
    <div key={index} className="image-item">
      <img src={image.preview} alt="" width="200" height="150" />
      <button onClick={() => handleDeleteImage(index)}>削除</button> 
    </div>
  ))}
</div> */}


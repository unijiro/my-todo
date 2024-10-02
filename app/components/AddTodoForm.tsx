// app/components/AddTodoForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Todo } from '../page'; // Todo インターフェースをインポート
import supabase from '../../utils/supabase';


interface AddTodoFormProps {
  onAddTodo: (newTodo: Todo) => void; 
}
let nextId = 1;


const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAddTodo }) => {
  const [title, setTitle] = useState('');

  // 新しいカラムに対応する state を追加
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);

  useEffect(() => {
    const initializeNextId = async () => {
      try {
        const { data, error } = await supabase
          .from('new_todo')
          .select('id')
          .order('id', { ascending: false })
          .limit(1);

        if (error) {
          throw error;
        }

        nextId = data.length === 0 ? 1 : data[0].id + 1;
      } catch (error) {
        console.error('Error initializing nextId:', error);
        // エラー処理を追加 (必要に応じて)
      }
    };

    initializeNextId();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '') return; 

    const today = new Date();
    const formattedDate = new Intl.DateTimeFormat('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).format(today);
    

    // onAddTodo に全てのプロパティを渡す
    onAddTodo({
      id:nextId++, 
      title, 
      completed: false, 
      created_at: formattedDate, 
      start_date: startDate, 
      end_date: endDate, 
      status, 
      description 
    }); 
    setTitle('');
    // 他の state もリセット
    setStartDate(null);
    setEndDate(null);
    setStatus(null);
    setDescription(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 既存の title 入力フィールド */}
      <input 
        type="text" 
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="新しい ToDo を入力..." 
      />

      {/* 新しい入力フィールド */}
      <input 
        type="date" 
        value={startDate || ''} 
        onChange={(e) => setStartDate(e.target.value)} 
        placeholder="開始日付" 
      />
      <input 
        type="date" 
        value={endDate || ''} 
        onChange={(e) => setEndDate(e.target.value)} 
        placeholder="終了日付" 
      />
      <input 
        type="text" 
        value={status || ''} 
        onChange={(e) => setStatus(e.target.value)} 
        placeholder="ステータス" 
      />
      <textarea 
        value={description || ''} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="説明文" 
      />

      <button type="submit">追加</button>
    </form>
  );
};

export default AddTodoForm;
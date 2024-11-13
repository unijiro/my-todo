// app/components/AddTodoForm.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Todo } from '../page'; // Todo インターフェースをインポート
import supabase from '../../utils/supabase';
import { uploadStorage } from '../storage';



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

  const [image_name, setImageName] = useState<string | null>(null);
  const [images, setImages] = useState<{ path: string, preview: string }[] | null>([]);
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);

  const [error, setError] = useState<string | null>(null);


  const today = new Date();

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
        console.log('Error initializing nextId:', error);
      }
    };

    initializeNextId();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (title.trim() === '') return; 

    let tmp_image_file:string = ''; 

    if (imageFiles) {
      // 複数の画像をアップロード
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        try {
          // ファイル名を生成 (例: 現在時刻 + 元のファイル名)
          const fileName = `${Date.now()}-${file.name}`;
          tmp_image_file = "https://smubosiwglzeoltgzkcp.supabase.co/storage/v1/object/public/pics/pics_folder/"+fileName;

          const { data, error } = await supabase.storage
            .from('pics')
            .upload(`pics_folder/${fileName}`, file);

          if (error) {
            throw error;
          }

          
        } catch (error) {
          console.error('Error uploading image:', error);
          // エラー処理
        }
      }
    }

    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0'); // 月は0から始まるので1を足す
    const day = today.getDate().toString().padStart(2, '0');

    const formattedDate = `${year}-${month}-${day}`;

    console.log(formattedDate);
    //console.log(String(today.getFullYear())-String(today.getMonth() + 1)-String(today.getDate()));
    // onAddTodo に全てのプロパティを渡す
    onAddTodo({
      id:nextId++, 
      title, 
      completed: false, 
      created_at: new Date().toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",day: "2-digit"}).replaceAll('/', '-'), 
      start_date: startDate, 
      end_date: endDate, 
      status, 
      description,
      image_name:tmp_image_file
    }); 
    setTitle('');
    setStartDate(null);
    setEndDate(null);
    setStatus(null);
    setDescription(null);
    setImageName(null);
    setImages(null);
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <label htmlFor="text">タイトル:</label>
      <input 
        type="text" 
        id="title"
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="新しい ToDo を入力..." 
      />

      {/* 新しい入力フィールド */}
      <label htmlFor="startDate">開始日付:</label>
      <input 
        type="date" 
        id="start_date"
        value={startDate || ''} 
        onChange={(e) => setStartDate(e.target.value)} 
        placeholder="開始日付" 
      />

      <label htmlFor="endDate">終了日付:</label>
      <input 
        type="date" 
        id="end_date"
        value={endDate || ''} 
        onChange={(e) => setEndDate(e.target.value)} 
        placeholder="終了日付" 
      />

      <label htmlFor="status">ステータス:</label>
        <select id="status" value={status || ''} onChange={(e) => setStatus(e.target.value)}>
          <option value="">選択してください</option>
          <option value="TODO">TODO</option>
          <option value="DOING">DOING</option>
          <option value="DONE">DONE</option>
      </select>

      <label htmlFor="description">説明文:</label>
      <textarea 
        id="description" 
        value={description || ''} 
        onChange={(e) => setDescription(e.target.value)} 
        placeholder="説明文" 
      />

      <label htmlFor="file-upload" className="custom-file-upload">
        <i className="fas fa-upload"></i> 画像を選択
          </label>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            className="sr-only"
            accept="image/png, image/jpeg"
            onChange={(e) => { setImageFiles(e.target.files); }}
            multiple
            aria-label="画像を選択" 
      />
      <button type="submit">追加</button>
    </form>
  );
};

export default AddTodoForm;

/* <input 
        type="text" 
        value={status || ''} 
        onChange={(e) => setImageName(e.target.value)} 
        placeholder="画像" 
      /> */
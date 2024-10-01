// app/components/TodoItem.tsx

import React from 'react';

interface TodoItemProps {
  id: number;
  title: string; 
  completed: boolean;
  created_at: string;
  start_date: string | null;
  end_date: string | null;
  status: string | null;
  description: string | null;
  onToggleCompleted: (id: number) => Promise<void>; 
  onDelete: (id: number) => Promise<void>; 
}

const TodoItem: React.FC<TodoItemProps> = ({ 
  id, 
  title, 
  completed, 
  created_at,
  start_date,
  end_date,
  status,
  description, 
  onToggleCompleted, 
  onDelete 
}) => {
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

      {/* 新しいカラムの値を表示 */}
      <p>開始日付: {start_date || '未設定'}</p>
      <p>終了日付: {end_date || '未設定'}</p>
      <p>ステータス: {status || '未設定'}</p>
      <p>説明文: {description || '未設定'}</p>
    </li>
  );
};

export default TodoItem;
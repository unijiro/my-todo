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
  image_name: string | null;
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
  image_name,
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
  created_at = new Date().toLocaleDateString("ja-JP", {year: "numeric",month: "2-digit",day: "2-digit"}).replaceAll('/', '-');

  return (
    
    <li>
      <table>
        <thead>
          <tr>
            <th>完了</th>
            <th>タイトル</th>
            <th>削除</th>
            <th>開始日付</th>
            <th>終了日付</th>
            <th>ステータス</th>
            <th>説明文</th>
            <th>作成日時</th>
            <th>画像</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <input 
                type="checkbox" 
                checked={completed} 
                onChange={handleToggleCompleted} 
              />
            </td>
            <td>
              <span style={{ textDecoration: completed ? 'line-through' : 'none' }}>{title}</span>
            </td>
            <td>
              <button onClick={handleDelete}>削除</button>
            </td>
            <td>{start_date || ' '}</td>
            <td>{end_date || ' '}</td>
            <td>{status || ' '}</td>
            <td>{description || ' '}</td>
            <td>{created_at}</td>
            <td>
              {image_name && (
                <img
                  src= {image_name}
                  alt={image_name} 
                  width="100" 
                  height="75"
                />
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </li>)
};

export default TodoItem;
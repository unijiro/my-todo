// app/api/todo.ts

import { NextResponse } from 'next/server';
import supabase from '../../../utils/supabase';

// Todo一覧取得
export async function GET() {
    try {
      const { data: todos, error } = await supabase
        .from('todos')
        .select('*')
        .order('id', { ascending: true }); 
  
      if (error) {
        console.error('Error fetching todos from Supabase:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
  
      return NextResponse.json(todos);
    } catch (error) {
      console.error('Error fetching todos:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
    } 
  }

// Todo新規作成
export async function POST(request: Request) {
  try {
    const { title } = await request.json();

    // title のバリデーション
    if (!title || typeof title !== 'string') {
      return new NextResponse("Invalid title", { status: 400 });
    }

    const { data: newTodo, error } = await supabase
      .from('todos')
      .insert({ title, completed: false }) // completed を false で初期化
      .select() 
      .single(); 

    if (error) {
      console.error('Error creating todo in Supabase:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  } 
}
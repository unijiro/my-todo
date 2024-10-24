// app/api/todo/route.ts

import { NextResponse } from 'next/server';
import supabase from '../../../utils/supabase';

// Todo一覧取得
export async function GET() {
  try {
    const { data: todos, error } = await supabase
      .from('new_todo') // テーブル名を new_todo に変更
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
    // interface post_type{
    //   title: string,
    //   start_date: string, 
    //   end_date: string, 
    //   status: string|undefined, 
    //   description: string|undefined
    // }
    
    const response = await request.json();

    const title: string = response.title;
    const start_date: string = response.start_date;
    const end_date: string = response.end_date;
    const status: string = response.status;
    const description: string = response.description; // 追加

    // title のバリデーション
    if (title == '' || title == null) {
      return new NextResponse("Invalid title", { status: 400 });
    }

    const { data: newTodo, error } = await supabase
      .from('new_todo') // テーブル名を new_todo に変更
      .insert({ title, completed: false, start_date, end_date, status, description }) // 追加
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
// app/api/todo/[id]/route.ts

import { NextResponse } from 'next/server';
import supabase from '../../../../utils/supabase';

// 特定の Todo を取得
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return new NextResponse("Missing id parameter", { status: 400 });
    }

    const { data: todo, error } = await supabase
      .from('new_todo') // テーブル名を new_todo に変更
      .select('*')
      .eq('id', Number(params.id)) 
      .single();

    if (error) {
      console.error('Error fetching todo from Supabase:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    if (!todo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error fetching todo:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Todo を更新
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return new NextResponse("Missing id parameter", { status: 400 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid id parameter", { status: 400 });
    }

    const { title, completed, start_date, end_date, status, description } = await request.json(); // start_date, end_date, status, description を追加

    // title, completed, start_date, end_date, status, description のいずれかが更新される場合のみ更新処理を実行
    if (title || completed !== undefined || start_date || end_date || status || description) {
      const { error } = await supabase
        .from('new_todo') // テーブル名を new_todo に変更
        .update({ title, completed, start_date, end_date, status, description }) // start_date, end_date, status, description を追加
        .eq('id', id);

      if (error) {
        console.error('Error updating todo in Supabase:', error);
        return new NextResponse("Internal Server Error", { status: 500 });
      }
    }

    // 更新後の Todo を取得して返す
    const { data: updatedTodo, error: selectError } = await supabase
      .from('new_todo') // テーブル名を new_todo に変更
      .select('*')
      .eq('id', id)
      .single();

    if (selectError) {
      console.error('Error fetching updated todo from Supabase:', selectError);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    if (!updatedTodo) {
      return new NextResponse("Todo not found", { status: 404 });
    }

    return NextResponse.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Todo を削除
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params.id) {
      return new NextResponse("Missing id parameter", { status: 400 });
    }

    const id = parseInt(params.id);
    if (isNaN(id)) {
      return new NextResponse("Invalid id parameter", { status: 400 });
    }

    const { error } = await supabase
      .from('new_todo') // テーブル名を new_todo に変更
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting todo in Supabase:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error deleting todo:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
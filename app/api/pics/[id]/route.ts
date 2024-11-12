// app/api/pics/[id]/route.ts

import { NextResponse } from 'next/server';
import supabase from '../../../../utils/supabase';

// ファイル削除
export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (filename === null) {
    return NextResponse.json({ error: 'Filename is missing' }, { status: 400 });
  }

  try {
    const { error } = await supabase.storage
      .from('images') // ストレージのバケット名を指定
      .remove([filename]);

    if (error) {
      console.error('Error deleting file from Supabase Storage:', error);
      return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
    }

    return NextResponse.json({ message: `File ${filename} deleted` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

// ファイル取得
export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (filename === null) {
    return NextResponse.json({ error: 'Filename is missing' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.storage
      .from('images') // ストレージのバケット名を指定
      .download(filename);

    if (error) {
      console.error('Error downloading file from Supabase Storage:', error);
      return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
    }

    // ファイルの内容とContent-Typeをレスポンスとして返す
    return new NextResponse(data!, {
      headers: {
        'Content-Type': 'image/jpeg', // 適切なContent-Typeを設定
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}
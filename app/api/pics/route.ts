// app/api/pics/route.ts

import { NextResponse } from 'next/server';
import supabase from '../../../utils/supabase';

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (filename === null) {
    return NextResponse.json({ error: 'Filename is missing' }, { status: 400 });
  }

  try {
    const blob = await fetch(filename);  // 'blob' is the correct variable name
    const buffer = await blob.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': blob.headers.get('Content-Type')!,  // Access from 'blob.headers'
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to retrieve file' }, { status: 500 });
  }
}

// The next lines are required for Pages API Routes only
export const dynamic = 'force-dynamic'
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new NextResponse("No file uploaded", { status: 400 });
    }

    const { data, error } = await supabase.storage
      .from('pics') // ストレージのバケット名を指定
      .upload(file.name, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading image to Supabase Storage:', error);
      return new NextResponse("Internal Server Error", { status: 500 });
    }

    // 画像への公開URLを生成
    const { data: publicUrlData} = supabase.storage
      .from('pics')
      .getPublicUrl(data.path);

    

    return NextResponse.json({ url: publicUrlData.publicUrl });
  } catch (error) {
    console.error('Error uploading image:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
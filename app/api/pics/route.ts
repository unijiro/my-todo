import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  // ⚠️ The below code is for App Router Route Handlers only
  if (filename === null || request.body === null) {
    return NextResponse.json({ error: 'Filename is missing' }, { status: 400 }); // Bad Request
  }

  const blob = await put(filename, request.body, { access: 'public' });
  return NextResponse.json(blob); 

  // Here's the code for Pages API Routes:
  // const blob = await put(filename, request, {
  //   access: 'public',
  // });

}

// The next lines are required for Pages API Routes only
export const config = {
  api: {
    bodyParser: false,
  },
};
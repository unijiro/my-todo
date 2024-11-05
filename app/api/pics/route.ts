import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { del as deleteBlob } from '@vercel/blob';

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

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (filename === null) {
    return NextResponse.json({ error: 'Filename is missing' }, { status: 400 });
  }

  try {
    await deleteBlob(filename);
    return NextResponse.json({ message: `File ${filename} deleted` });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}

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
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };
import { put } from '@vercel/blob';

export const config = {
  runtime: 'nodejs',
};

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return new Response(JSON.stringify({ error: 'Expected multipart/form-data' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return new Response(JSON.stringify({ error: 'Missing file' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!file.type.startsWith('image/')) {
      return new Response(JSON.stringify({ error: 'File must be an image' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (file.size > 2 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image must be smaller than 2MB' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const ext = file.name.includes('.') ? file.name.split('.').pop() : undefined;
    const fileName = `menu-${Date.now()}-${Math.random().toString(16).slice(2)}${ext ? `.${ext}` : ''}`;

    const blob = await put(fileName, file, {
      access: 'public',
    });

    return new Response(JSON.stringify({ imageUrl: blob.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Upload failed',
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


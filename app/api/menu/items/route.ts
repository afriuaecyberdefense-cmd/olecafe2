import kv from '@vercel/kv';
import { DEFAULT_MENU_ITEMS } from '../../../src/data/menuData';

const { get: kvGet, set: kvSet } = kv;


const KV_KEY = 'olecafe:menuItems';

export async function GET() {
  try {
    const data = await kvGet<string>(KV_KEY);

    if (!data) {
      return new Response(JSON.stringify({ items: DEFAULT_MENU_ITEMS }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const parsed = JSON.parse(data) as typeof DEFAULT_MENU_ITEMS;
    if (!Array.isArray(parsed)) {
      return new Response(JSON.stringify({ items: DEFAULT_MENU_ITEMS }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ items: parsed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: 'Failed to load menu items',
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

export async function PUT(req: Request) {
  if (req.method !== 'PUT') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as { items: any };
    if (!body || !Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: 'Invalid body' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Store full array. This includes imageUrl values (Vercel Blob public URLs).
    await kvSet(KV_KEY, JSON.stringify(body.items));

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[menu/items PUT] failed', {
      kvKey: KV_KEY,
      message: err instanceof Error ? err.message : String(err),
    });

    return new Response(
      JSON.stringify({
        error: 'Failed to save menu items',
        details: err instanceof Error ? err.message : String(err),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}


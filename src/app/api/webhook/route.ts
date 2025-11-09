import { NextRequest, NextResponse } from 'next/server';
import { getInventoryBySku, getOrderById } from '@/lib/googleSheets';

function xmlEscape(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapMessage(body: string) {
  const xml = `<Response><Message>${xmlEscape(body)}</Message></Response>`;
  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'text/xml',
    },
  });
}

function buildHelpMessage() {
  return [
    '👋 Hi! I can help with order status and inventory.',
    '',
    'Order status:',
    '• Send an order ID (e.g. 12345)',
    '• Or type "order 12345"',
    '',
    'Inventory:',
    '• "inventory SKU123"',
    '• Or provide a product name',
  ].join('\n');
}

async function handleOrderQuery(orderId: string) {
  const record = await getOrderById(orderId);
  if (!record) {
    return wrapMessage(`❌ Could not find an order with ID "${orderId}". Please check the number and try again.`);
  }

  const lines = [
    `📦 Order ${record.orderId}`,
    `Status: ${record.status}`,
  ];

  if (record.updatedAt) {
    lines.push(`Updated: ${record.updatedAt}`);
  }

  if (record.notes) {
    lines.push('');
    lines.push(record.notes);
  }

  return wrapMessage(lines.join('\n'));
}

async function handleInventoryQuery(item: string) {
  const record = await getInventoryBySku(item);
  if (!record) {
    return wrapMessage(`❌ Could not find inventory for "${item}". Try a different SKU or product name.`);
  }

  const lines = [
    `📦 Inventory for ${record.name ?? record.sku}`,
    `SKU: ${record.sku}`,
    `Quantity: ${Number.isFinite(record.quantity) ? record.quantity : 'Unknown'}`,
  ];

  if (record.updatedAt) {
    lines.push(`Updated: ${record.updatedAt}`);
  }

  return wrapMessage(lines.join('\n'));
}

function parseIntent(message: string) {
  const cleaned = message.trim();
  if (!cleaned) return { type: 'help' as const };

  const normalized = cleaned.toLowerCase();

  if (normalized === 'help' || normalized === 'menu' || normalized === 'hi' || normalized === 'hello') {
    return { type: 'help' as const };
  }

  const inventoryMatch = normalized.match(/^(inventory|stock)\s+(.+)/);
  if (inventoryMatch) {
    return { type: 'inventory' as const, query: inventoryMatch[2].trim() };
  }

  const orderMatch = normalized.match(/^(order|status)\s+(.+)/);
  if (orderMatch) {
    return { type: 'order' as const, orderId: orderMatch[2].trim() };
  }

  if (/^\d{3,}$/.test(normalized)) {
    return { type: 'order' as const, orderId: cleaned };
  }

  return { type: 'inventory' as const, query: cleaned };
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') ?? '';
    let bodyText = '';

    if (contentType.includes('application/json')) {
      const body = await request.json();
      bodyText = String(body.Body ?? body.message ?? '');
    } else {
      const formData = await request.formData();
      bodyText = String(formData.get('Body') ?? '');
    }

    const intent = parseIntent(bodyText);

    switch (intent.type) {
      case 'help':
        return wrapMessage(buildHelpMessage());
      case 'order':
        return await handleOrderQuery(intent.orderId);
      case 'inventory':
        return await handleInventoryQuery(intent.query);
      default:
        return wrapMessage(buildHelpMessage());
    }
  } catch (error) {
    console.error('[webhook] error', error);
    return wrapMessage('⚠️ Something went wrong while processing your request. Please try again.');
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

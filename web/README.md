## WhatsApp SheetBot

Next.js + Twilio ready webhook that serves WhatsApp replies using live data from Google Sheets.

### 1. Requirements

- Twilio WhatsApp sandbox or a verified WhatsApp Business number
- Google Cloud service account with read access to the target spreadsheet
- Environment variables configured in `.env.local`

### 2. Environment variables

Copy `.env.example` to `.env.local` and set the values:

| Variable | Description |
| --- | --- |
| `GOOGLE_CLIENT_EMAIL` | Service account email address |
| `GOOGLE_PRIVATE_KEY` | Service account private key with newlines escaped (`\n`) |
| `GOOGLE_SPREADSHEET_ID` | Spreadsheet ID containing Orders & Inventory tabs |
| `GOOGLE_ORDERS_RANGE` | Optional override for the orders range (default `Orders!A2:E`) |
| `GOOGLE_INVENTORY_RANGE` | Optional override for the inventory range (default `Inventory!A2:D`) |

Share the spreadsheet with the service account email so it can read data.

### 3. Google Sheet layout

- **Orders** tab columns: `OrderId`, `Status`, `UpdatedAt`, `Notes...`
- **Inventory** tab columns: `SKU`, `Name`, `Quantity`, `UpdatedAt`

Additional columns after the listed ones are concatenated into the reply.

### 4. Local development

```bash
npm install
npm run dev
```

Expose your local server with a tunneling tool (e.g. `ngrok`) and configure the Twilio webhook to `https://<tunnel>/api/webhook`.

### 5. Deploy

Deploy to Vercel and set the same environment variables. Configure Twilio to call:

```
https://<your-vercel-domain>/api/webhook
```

Incoming messages that match an order ID return the latest status, and any other message is treated as an inventory lookup. Send `help` to receive a quick usage guide.

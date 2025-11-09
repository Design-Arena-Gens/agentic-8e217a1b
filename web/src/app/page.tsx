export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-12 px-6 py-24">
        <section className="space-y-6">
          <span className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1 text-xs uppercase tracking-[0.3em] text-slate-300">
            WhatsApp Automation
          </span>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Order status & inventory updates straight from Google Sheets.
          </h1>
          <p className="max-w-2xl text-lg text-slate-300">
            Connect your fulfillment data to WhatsApp and answer customer questions instantly.
            Drop new entries into your spreadsheet and the chatbot takes care of the rest.
          </p>
          <div className="flex flex-wrap gap-3 text-sm text-slate-200">
            <span className="rounded-full border border-emerald-400/40 bg-emerald-400/10 px-3 py-1">
              Spreadsheet powered
            </span>
            <span className="rounded-full border border-cyan-400/40 bg-cyan-400/10 px-3 py-1">
              Twilio compatible
            </span>
            <span className="rounded-full border border-violet-400/40 bg-violet-400/10 px-3 py-1">
              Vercel ready
            </span>
          </div>
        </section>

        <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold">Supported commands</h2>
          <ul className="grid gap-3 text-base text-slate-200">
            <li>
              <span className="font-semibold text-white">Order status:</span> send an order ID like
              <span className="whitespace-nowrap font-mono text-emerald-300"> 12345 </span>
              or type
              <span className="whitespace-nowrap font-mono text-emerald-300"> order 12345</span>
              to retrieve the latest status.
            </li>
            <li>
              <span className="font-semibold text-white">Inventory check:</span> message
              <span className="whitespace-nowrap font-mono text-cyan-300"> inventory SKU123 </span>
              or share a product name to see stock levels.
            </li>
            <li>
              <span className="font-semibold text-white">Help:</span> send{" "}
              <span className="font-mono text-violet-300">help</span> to get usage tips.
            </li>
          </ul>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-black/30 p-8">
          <h2 className="text-2xl font-semibold">Connect your data</h2>
          <ol className="grid gap-4 text-base text-slate-200">
            <li>
              Duplicate the provided Google Sheet template with tabs named
              <span className="whitespace-nowrap font-mono text-slate-100"> Orders </span>
              and
              <span className="whitespace-nowrap font-mono text-slate-100"> Inventory</span>. Keep the first
              row for headers and start data from row 2.
            </li>
            <li>
              Share the sheet with your service account (
              <span className="font-mono text-emerald-200">GOOGLE_CLIENT_EMAIL</span>) so it can read data.
            </li>
            <li>
              Set the environment variables described below, then deploy to Vercel.
            </li>
          </ol>
        </section>

        <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h2 className="text-2xl font-semibold">Environment variables</h2>
          <div className="grid gap-2 font-mono text-sm text-slate-100">
            <span>GOOGLE_CLIENT_EMAIL</span>
            <span>GOOGLE_PRIVATE_KEY</span>
            <span>GOOGLE_SPREADSHEET_ID</span>
            <span>(optional) GOOGLE_ORDERS_RANGE</span>
            <span>(optional) GOOGLE_INVENTORY_RANGE</span>
          </div>
          <p className="text-sm text-slate-300">
            Store the service account private key with literal newlines escaped as
            <span className="font-mono text-slate-100"> \n</span>. The API expects read-only scopes.
          </p>
        </section>

        <section className="grid gap-4 rounded-3xl border border-white/10 bg-black/60 p-8">
          <h2 className="text-2xl font-semibold">Webhook setup</h2>
          <p className="text-base text-slate-200">
            Point your WhatsApp sandbox or production number to
            <span className="font-mono text-emerald-200"> /api/webhook</span> using Twilio&apos;s console.
            Incoming messages are parsed automatically and answered with TwiML.
          </p>
        </section>
      </main>
    </div>
  );
}

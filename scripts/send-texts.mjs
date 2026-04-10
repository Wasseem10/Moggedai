// Railway cron service runs this every 30 min
// Set APP_URL and CRON_SECRET as env vars in Railway

const url = `${process.env.APP_URL}/api/cron/send-texts`;
const secret = process.env.CRON_SECRET;

if (!url || !secret) {
  console.error("Missing APP_URL or CRON_SECRET");
  process.exit(1);
}

const res = await fetch(url, {
  headers: { "x-cron-secret": secret },
});

const data = await res.json();
console.log(`[${new Date().toISOString()}]`, data);

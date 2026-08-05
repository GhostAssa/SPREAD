import { Resend } from "resend";
import { getSubscribers, unsubscribeToken } from "@/lib/newsletter";
import type { Article } from "@/lib/types";
import type { Tip } from "@/lib/tips";

const BATCH_SIZE = 100;

function siteUrl(): string {
  return process.env.SITE_URL ?? "http://localhost:3000";
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL ?? "Spread <onboarding@resend.dev>";
}

function buildEmailHtml(article: Article, unsubscribeUrl: string): string {
  const articleUrl = `${siteUrl()}/news/${article.slug}`;
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;background:#F4F1E7;color:#23302F;">
      <p style="font-family:monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#C0522E;margin:0 0 12px;">Breaking &middot; Spread</p>
      <h1 style="font-size:28px;line-height:1.15;margin:0 0 16px;color:#10262D;">${escapeHtml(article.title)}</h1>
      <p style="font-size:16px;line-height:1.6;margin:0 0 24px;">${escapeHtml(article.excerpt)}</p>
      <a href="${articleUrl}" style="display:inline-block;background:#FFB954;border:2px solid #10262D;color:#10262D;font-weight:bold;text-decoration:none;padding:12px 24px;border-radius:999px;">Read the full story</a>
      <p style="font-size:12px;color:#847562;margin-top:40px;">
        You're getting this because you subscribed to Spread.
        <a href="${unsubscribeUrl}" style="color:#847562;">Unsubscribe</a>
      </p>
    </div>
  `;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function chunk<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
}

export type NotifyResult =
  | { skipped: true; reason: string }
  | { skipped: false; sent: number; failed: number; errors: string[] };

export async function sendBreakingNewsEmail(article: Article): Promise<NotifyResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: "RESEND_API_KEY is not set in .env.local" };
  }

  const subscribers = getSubscribers();
  if (subscribers.length === 0) {
    return { skipped: true, reason: "No newsletter subscribers yet" };
  }

  const resend = new Resend(apiKey);
  const subject = `BREAKING: ${article.title}`;

  const emails = await Promise.all(
    subscribers.map(async (s) => ({
      from: fromAddress(),
      to: s.email,
      subject,
      html: buildEmailHtml(
        article,
        `${siteUrl()}/api/newsletter/unsubscribe?email=${encodeURIComponent(s.email)}&token=${await unsubscribeToken(s.email)}`
      ),
    }))
  );

  let sent = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const batch of chunk(emails, BATCH_SIZE)) {
    const result = await resend.batch.send(batch);
    if (result.error) {
      failed += batch.length;
      errors.push(result.error.message);
      console.error("[newsletter] Resend batch send failed:", result.error);
    } else {
      sent += batch.length;
    }
  }

  return { skipped: false, sent, failed, errors };
}

function buildTipAlertHtml(tip: Tip): string {
  const evidenceLine = tip.evidenceUrl
    ? `<p style="font-size:14px;"><a href="${siteUrl()}${tip.evidenceUrl}" style="color:#C0522E;">View attached evidence</a></p>`
    : "";
  return `
    <div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;padding:24px;background:#F4F1E7;color:#23302F;">
      <p style="font-family:monospace;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;color:#D92974;margin:0 0 12px;">New Tip Received</p>
      <p style="font-size:14px;margin:0 0 4px;"><strong>Category:</strong> ${escapeHtml(tip.category || "Unspecified")}</p>
      <p style="font-size:14px;margin:0 0 16px;"><strong>Urgency:</strong> ${escapeHtml(tip.urgency || "Standard")}</p>
      <div style="font-size:16px;line-height:1.6;background:#fff;border:2px solid #10262D;border-radius:8px;padding:16px;margin:0 0 16px;white-space:pre-wrap;">${escapeHtml(tip.message)}</div>
      ${evidenceLine}
      <p style="font-size:12px;color:#847562;margin-top:32px;">
        Review it in the <a href="${siteUrl()}/admin/tips" style="color:#847562;">admin dashboard</a>.
      </p>
    </div>
  `;
}

export type TipAlertResult = { skipped: true; reason: string } | { skipped: false; sent: boolean };

export async function sendTipAlertEmail(tip: Tip): Promise<TipAlertResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const alertEmail = process.env.TIP_ALERT_EMAIL;

  if (!apiKey) return { skipped: true, reason: "RESEND_API_KEY is not set" };
  if (!alertEmail) return { skipped: true, reason: "TIP_ALERT_EMAIL is not set" };

  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from: fromAddress(),
    to: alertEmail,
    subject: `New tip: ${tip.category || "General"} (${tip.urgency || "Standard"})`,
    html: buildTipAlertHtml(tip),
  });

  if (result.error) {
    console.error("[tips] Resend send failed:", result.error);
    return { skipped: false, sent: false };
  }
  return { skipped: false, sent: true };
}

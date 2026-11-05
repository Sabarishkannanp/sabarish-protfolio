const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TOPICS = ["A job", "A project", "Just hello"];

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const name = String(body.name ?? "").trim();
  const email = String(body.email ?? "").trim();
  const message = String(body.message ?? "").trim();
  const topic = TOPICS.includes(String(body.topic)) ? String(body.topic) : "Just hello";

  // Honeypot: bots fill hidden fields. Pretend it worked.
  if (body.company) return Response.json({ ok: true });

  if (!name || name.length > 100) return Response.json({ error: "Please enter your name." }, { status: 400 });
  if (!EMAIL_RE.test(email) || email.length > 200)
    return Response.json({ error: "Please enter a valid email." }, { status: 400 });
  if (message.length < 10 || message.length > 4000)
    return Response.json({ error: "Message should be 10–4000 characters." }, { status: 400 });

  // TODO: send the email. Two easy options:
  //
  // 1) Resend (recommended on Vercel) — `npm i resend`, add RESEND_API_KEY in Vercel env vars:
  //    import { Resend } from "resend";
  //    const resend = new Resend(process.env.RESEND_API_KEY);
  //    await resend.emails.send({
  //      from: "Portfolio <onboarding@resend.dev>",
  //      to: "sabarishkannanp2004@gmail.com",
  //      replyTo: email,
  //      subject: `[Portfolio] ${topic} — ${name}`,
  //      text: message,
  //    });
  //
  // 2) Nodemailer with Gmail SMTP — `npm i nodemailer`, use an App Password.
  console.info("[contact]", { name, email, topic, length: message.length });

  return Response.json({ ok: true });
}

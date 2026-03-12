import nodemailer from "nodemailer";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, trackingCode } = await req.json();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: Deno.env.get("SMTP_EMAIL"),
        pass: Deno.env.get("SMTP_PASSWORD"),
      },
    });

    const mailOptions = {
      from: Deno.env.get("SMTP_EMAIL"),
      to: email,
      subject: "LMS Concern Submitted",
      text: `Your LMS concern has been received.

Tracking Number: ${trackingCode}
Status: Pending`,
    };

    await transporter.sendMail(mailOptions);

    return new Response(
      JSON.stringify({ message: "Email sent" }),
      { headers: corsHeaders, status: 200 }
    );

  } catch (error) {

    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: corsHeaders, status: 500 }
    );

  }

});
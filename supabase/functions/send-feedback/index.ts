import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FeedbackRequest {
  message: string;
  rating?: number;
  pageName: string;
  timestamp: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, rating, pageName, timestamp }: FeedbackRequest = await req.json();

    if (!message || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const ratingDisplay = rating ? `${"★".repeat(rating)}${"☆".repeat(5 - rating)} (${rating}/5)` : "Not provided";

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #3b82f6;">📬 New Resumate Feedback</h1>
        <p><strong>Page:</strong> ${pageName}</p>
        <p><strong>Rating:</strong> ${ratingDisplay}</p>
        <p><strong>Message:</strong></p>
        <p style="background: #f8f9fa; padding: 12px; border-radius: 6px;">${message.replace(/\n/g, "<br>")}</p>
        <p style="color: #6b7280; font-size: 12px;">Submitted: ${new Date(timestamp).toLocaleString()}</p>
      </div>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Resumate <onboarding@resend.dev>",
        to: ["adityakittad23@gmail.com"],
        subject: `[Resumate] ${rating ? `${rating}★` : "New"} feedback from ${pageName}`,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend error:", error);
      throw new Error("Email send failed");
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to send feedback" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
});

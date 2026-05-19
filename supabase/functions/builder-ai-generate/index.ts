// Lovable AI gateway: generate builder page content from a prompt
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ALLOWED_TYPES = [
  "section", "container", "hero", "heading", "paragraph", "button", "image",
  "divider", "spacer", "video", "social", "navbar", "about", "services",
  "pricing", "testimonial", "contact", "footer", "gallery", "form",
  "accordion", "tabs", "alert", "iconBox", "counter", "progress", "stats",
  "faq", "cta", "team", "logos", "countdown", "carousel",
];

const SYSTEM_PROMPT = `You are an expert landing-page designer for a no-code page builder.
Given a user description, output a single JSON object with this exact shape:

{
  "theme": {
    "primaryColor": "#hex",
    "background": "#hex or css gradient",
    "fontFamily": "Inter, sans-serif",
    "headingFontFamily": "Space Grotesk, sans-serif",
    "buttonRadius": "12px"
  },
  "header": { "type": "navbar", "content": { "brand": "...", "links": [{"label":"...","url":"#"}], "ctaText": "...", "ctaLink": "#" }, "style": {} },
  "footer": { "type": "footer", "content": { "brand": "...", "tagline": "...", "copyright": "© 2025" }, "style": {} },
  "blocks": [
    { "type": "hero", "content": { "eyebrow": "...", "title": "...", "subtitle": "...", "ctaText": "...", "ctaLink": "#" }, "style": { "paddingTop":"120px","paddingBottom":"120px","textAlign":"center","animation":"fade-up" } },
    { "type": "services", "content": { "title": "...", "items": [{"title":"...","body":"..."}] }, "style": {} },
    ...
  ]
}

Rules:
- "type" MUST be one of: ${ALLOWED_TYPES.join(", ")}.
- Use 6-10 blocks: hero, then mix of services/stats/about/pricing/testimonial/faq/cta/contact.
- Set realistic content; never use Lorem Ipsum.
- Pick a cohesive theme based on the topic. Use modern colors.
- All style values are CSS strings.
- Return ONLY the JSON object, no markdown, no commentary.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Missing prompt" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (aiRes.status === 429) {
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
        status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (aiRes.status === 402) {
      return new Response(JSON.stringify({ error: "AI credits exhausted. Add credits in workspace." }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!aiRes.ok) {
      const txt = await aiRes.text();
      return new Response(JSON.stringify({ error: `AI error: ${txt}` }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiRes.json();
    const raw = data.choices?.[0]?.message?.content ?? "{}";
    let parsed: any;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const m = raw.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : {};
    }

    // Sanitize: drop unknown block types
    const filterBlock = (b: any): any => {
      if (!b || typeof b !== "object" || !ALLOWED_TYPES.includes(b.type)) return null;
      return {
        type: b.type,
        content: b.content || {},
        style: b.style || {},
        children: Array.isArray(b.children) ? b.children.map(filterBlock).filter(Boolean) : undefined,
      };
    };

    const result = {
      theme: parsed.theme || {},
      header: parsed.header ? filterBlock(parsed.header) : null,
      footer: parsed.footer ? filterBlock(parsed.footer) : null,
      blocks: Array.isArray(parsed.blocks) ? parsed.blocks.map(filterBlock).filter(Boolean) : [],
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e?.message || "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

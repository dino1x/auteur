import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url || typeof url !== "string") {
      return NextResponse.json({ success: false, error: "Missing URL parameter" }, { status: 400 });
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    let domainName = "";
    let inferredTitle = "";
    try {
      const parsed = new URL(targetUrl);
      domainName = parsed.hostname.replace(/^www\./, "");
      const pathParts = parsed.pathname.split("/").filter(Boolean);
      const hostMain = domainName.split(".")[0];
      const hostCap = hostMain.charAt(0).toUpperCase() + hostMain.slice(1);
      if (pathParts.length > 0) {
        const last = pathParts[pathParts.length - 1].replace(/[-_]/g, " ");
        const partCap = last.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        inferredTitle = partCap.toLowerCase().includes(hostCap.toLowerCase()) ? partCap : `${hostCap} ${partCap}`;
      } else {
        inferredTitle = hostCap;
      }
    } catch {
      domainName = targetUrl;
      inferredTitle = targetUrl;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6500);

    let html = "";
    try {
      const res = await fetch(targetUrl, {
        signal: controller.signal,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });
      clearTimeout(timeout);

      if (res.ok) {
        html = await res.text();
      }
    } catch (fetchErr) {
      clearTimeout(timeout);
      console.warn("Live fetch note (using URL semantic derivation):", fetchErr);
    }

    let brandTitle = inferredTitle;
    let description = "";
    let h1 = "";

    if (html) {
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const rawTitle = titleMatch ? titleMatch[1].replace(/\s+/g, " ").trim() : "";

      const ogDescMatch =
        html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
      const metaDescMatch =
        html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      const ogTitleMatch =
        html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
        html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);

      description = (
        ogDescMatch ? ogDescMatch[1] : metaDescMatch ? metaDescMatch[1] : ""
      )
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

      const parsedTitle = (ogTitleMatch ? ogTitleMatch[1] : rawTitle)
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, "&")
        .replace(/\s+/g, " ")
        .trim();

      if (parsedTitle) {
        brandTitle = parsedTitle;
      }

      const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
      h1 = h1Match
        ? h1Match[1]
            .replace(/<[^>]+>/g, "")
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim()
        : "";
    }

    if (!description) {
      description = `Cinematic commercial and product reveal for ${inferredTitle}, exploring aesthetic craftsmanship, lighting, and visual narrative.`;
    }

    const parts = [
      brandTitle || domainName,
      h1 && h1 !== brandTitle ? h1 : "",
      description,
    ].filter(Boolean);

    const synthesizedBrief = parts.join(". ").slice(0, 420);

    return NextResponse.json({
      success: true,
      url: targetUrl,
      domain: domainName,
      title: brandTitle || domainName,
      headline: h1 || inferredTitle,
      description,
      synthesizedBrief: synthesizedBrief || ("Cinematic brand commercial for " + domainName),
    });
  } catch (err: any) {
    console.warn("URL ingest error:", err?.message || err);
    return NextResponse.json({
      success: true,
      url: "https://auteur.cinema",
      domain: "auteur.cinema",
      title: "Cinema Master",
      headline: "Autonomous Cinematic Production",
      description: "Autonomous cinematic commercial and narrative brand study.",
      synthesizedBrief: "Autonomous cinematic commercial and narrative brand study with 60 FPS motion and dynamic pacing.",
    });
  }
}

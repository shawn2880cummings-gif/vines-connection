import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/lib/products";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  const productId = req.nextUrl.searchParams.get("product_id");

  if (!sessionId || !productId) {
    return NextResponse.json(
      { error: "Missing session or product ID" },
      { status: 400 }
    );
  }

  // Verify payment was successful
  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    if (session.payment_status !== "paid") {
      return NextResponse.json(
        { error: "Payment not completed" },
        { status: 403 }
      );
    }

    // Verify this session was for this product
    if (session.metadata?.productId !== productId) {
      return NextResponse.json(
        { error: "Product mismatch" },
        { status: 403 }
      );
    }

    const product = getProduct(productId);
    if (!product || !product.fileName) {
      return NextResponse.json(
        { error: "Product file not found" },
        { status: 404 }
      );
    }

    // Read and serve the file
    const filePath = path.join(
      process.cwd(),
      "digital-products",
      product.fileName
    );
    const fileBuffer = await readFile(filePath);

    const ext = path.extname(product.fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      ".pdf": "application/pdf",
      ".epub": "application/epub+zip",
      ".zip": "application/zip",
      ".mp3": "audio/mpeg",
      ".mp4": "video/mp4",
    };

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": mimeTypes[ext] || "application/octet-stream",
        "Content-Disposition": `attachment; filename="${product.fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Download failed" },
      { status: 500 }
    );
  }
}

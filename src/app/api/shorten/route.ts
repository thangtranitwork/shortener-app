// src/app/api/shorten/route.ts
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";

// Object tĩnh lưu trữ URL và mật khẩu
export const urlStore: Record<string, { originalUrl: string; password?: string }> = {};

export async function POST(req: Request) {
  try {
    const { url, alias, password } = await req.json();

    if (!url) {
      return new Response(JSON.stringify({ error: "URL is required" }), {
        status: 400,
      });
    }

    // Kiểm tra alias nếu được cung cấp
    if (alias && urlStore[alias]) {
      return new Response(JSON.stringify({ error: "Alias already exists" }), {
        status: 400,
      });
    }

    const shortId = alias || nanoid(8);
    let hashedPassword = undefined;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    // Lưu trữ URL vào object tĩnh
    urlStore[shortId] = {
      originalUrl: url,
      password: hashedPassword,
    };

    return new Response(
      JSON.stringify({
        shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ error: "Server error", message: error.message }),
      { status: 500 }
    );
  }
}

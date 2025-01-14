import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongo"; // Sửa lại đường dẫn
import Url from "@/models/Url"; // Sửa lại đường dẫn

export async function POST(req: Request) {
  
  try {
    const { url, alias, password } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }
    await connectDB();

    // Kiểm tra alias nếu được cung cấp
    if (alias) {
      const existingUrl = await Url.findOne({ alias });
      if (existingUrl) {
        return NextResponse.json(
          { error: "Alias already exists" },
          { status: 400 }
        );
      }
    }

    const shortId = alias || nanoid(8);
    let hashedPassword = null;

    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const newUrl = await Url.create({
      originalUrl: url,
      shortId,
      alias: alias || undefined,
      password: hashedPassword,
    });

    return NextResponse.json({
      shortUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/${shortId}`,
    });
  } catch (error: any) {
    console.error("Detailed error:", error);
    return NextResponse.json(
      {
        error: "Server error",
        message: error.message,
      },
      { status: 500 }
    );
  }
}

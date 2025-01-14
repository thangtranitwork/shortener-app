import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongo";
import Url from "@/models/Url";

export async function POST(request: Request) {
  await connectDB();

  try {
    const { shortId, password } = await request.json();

    if (!shortId || !password) {
      return NextResponse.json(
        { error: "Short ID and password are required." },
        { status: 400 }
      );
    }

    const url = await Url.findOne({ shortId });

    if (!url) {
      return NextResponse.json({ error: "URL not found." }, { status: 404 });
    }

    // So sánh mật khẩu đã nhập với mật khẩu mã hóa
    const isPasswordValid = await bcrypt.compare(password, url.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 403 }
      );
    }

    return NextResponse.json({ originalUrl: url.originalUrl });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { urlStore } from "@/app/api/shorten/route"; // Import object `urlStore`

export async function POST(request: Request) {
  try {
    const { shortId, password } = await request.json();

    if (!shortId || !password) {
      return NextResponse.json(
        { error: "Short ID and password are required." },
        { status: 400 }
      );
    }

    // Lấy URL từ object `urlStore`
    const urlEntry = urlStore[shortId];

    if (!urlEntry) {
      return NextResponse.json({ error: "URL not found." }, { status: 404 });
    }

    // Kiểm tra nếu URL không được bảo vệ bằng mật khẩu
    if (!urlEntry.password) {
      return NextResponse.json(
        { error: "This URL is not password protected." },
        { status: 400 }
      );
    }

    // So sánh mật khẩu đã nhập với mật khẩu được mã hóa
    const isPasswordValid = await bcrypt.compare(password, urlEntry.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect password." },
        { status: 403 }
      );
    }

    // Trả về URL gốc nếu mật khẩu chính xác
    return NextResponse.json({ originalUrl: urlEntry.originalUrl });
  } catch (error: any) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Server error", message: error.message },
      { status: 500 }
    );
  }
}

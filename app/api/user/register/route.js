import { NextResponse } from "next/server";
import supabase from "@/utits/connectdb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  try {
    const { email, username, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "กรุณากรอกข้อมูลให้ครบ" },
        { status: 400 }
      );
    }

    const { data: existingUser } = await supabase
      .from("users")
      .select("id,username, email, password")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { message: "อีเมลนี้ถูกใช้แล้ว" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const {data:newUser, error: insertError } = await supabase
      .from("users")
      .insert([{ email, username, password: hashedPassword }])
      .single()

    if (insertError) {
      return NextResponse.json(
        { message: insertError.message || "ไม่สามารถสมัครสมาชิกได้" },
        { status: 500 }
      );
    }

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return NextResponse.json(
      { message: "สมัครสมาชิกสำเร็จ", token },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import supabase from "@/utits/connectdb";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, password } = await request.json();

  const { data: user, error } = await supabase
    .from("users")
    .select("id,username, email, password") 
    .eq("email", email)
    .single();


  if (error || !user) {
    return NextResponse.json(
      { success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { success: false, message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
      { status: 401 }
    );
  }

      const token = jwt.sign(
        { id: user.id, username: user.username, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

  return NextResponse.json(
    { success: true, username: user.username, message: "login success",token },
    { status: 200 }
  );
}

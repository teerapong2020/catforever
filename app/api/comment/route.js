import { NextResponse } from "next/server";
import supabase from "@/utits/connectdb";

export async function POST(request) {
  try {
    const { user_id, username, catid, comment } = await request.json();

    if (!user_id || !comment || !catid || !username) {
      return NextResponse.json({ message: "กรุณากรอกข้อมูลให้ครบ" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert([{ user_id, catid, comment }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "โพสต์สำเร็จ", comment: { ...data, username } }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" }, { status: 500 });
  }
}


export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const catid = searchParams.get("catid");

    if (!catid) return NextResponse.json([], { status: 200 });

    const { data, error } = await supabase
      .from("comments")
      .select("comment, created_at, user_id, users(username)")
      .eq("catid", catid)
      .order("created_at", { ascending: true });

    if (error) return NextResponse.json({ message: error.message }, { status: 500 });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" }, { status: 500 });
  }
}
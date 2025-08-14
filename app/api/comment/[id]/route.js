import { NextResponse } from "next/server";
import supabase from "@/utits/connectdb";

export async function DELETE(req, { params }) {
  const { id } = params;

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "ลบคอมเมนต์สำเร็จ" },
    { status: 200 }
  );
}

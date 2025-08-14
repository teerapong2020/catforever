"use client";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !username || !password || !confirmPassword) {
      alert("❗ กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    if (!emailFormat.test(email)) {
      alert("❗ กรุณากรอกอีเมลให้ถูกต้อง");
      return;
    }
    if (password !== confirmPassword) {
      alert("❗ รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      const res = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาด");
      }

      document.cookie = `token=${data.token}`;
      window.location.href = "/catfeedback";
      alert("✅ สมัครสมาชิกสำเร็จ");
    } catch (err) {
      alert(`❌ ${err.message}`);
    }
  };

  return (
    <div className="w-screen flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-1/3 max-md:w-full mx-8"
      >
        <img
          src="/logo.jpg"
          width={"120px"}
          className=" rounded-2xl w-1/3 mx-auto"
        ></img>
        <div>
          <label className="block text-lg font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border p-2 rounded w-full disabled:opacity-50"
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="border p-2 rounded w-full disabled:opacity-50"
            placeholder="Enter Username"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border p-2 rounded w-full disabled:opacity-50"
            placeholder="Enter your password"
          />
        </div>

        <div>
          <label className="block text-lg font-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="border p-2 rounded w-full disabled:opacity-50"
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-black transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          register
        </button>
        <Link href="/">
          <button className=" text-black w-full p-2 rounded hover:text-blue-600 transition-colors text-center mt-4">
            login
          </button>
        </Link>
      </form>
    </div>
  );
}

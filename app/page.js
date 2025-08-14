"use client";
import { useState } from "react";
import Link from "next/link";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailFormat.test(email)) {
      alert("รูปแบบอีเมลไม่ถูกต้อง");
      return;
    }
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        document.cookie = `token=${data.token}`;
        window.location.href = "/catfeedback";
      }
      alert(data.message)
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center w-screen ">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-1/3 max-md:w-full m-8"
      >
        <img src="/logo.jpg" className=" rounded-2xl w-1/2 mx-auto"></img>
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

        <button
          type="submit"
          className="bg-blue-500 text-white p-2 rounded hover:bg-black transition-colors w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          login
        </button>
        <Link href="/register">
          <button className=" text-black w-full p-1 rounded hover:text-blue-900  transition-colors text-center ">
            Register
          </button>
        </Link>
      </form>
    </div>
  );
}

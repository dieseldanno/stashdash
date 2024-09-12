"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("example@mail.com");
  const [password, setPassword] = useState("******");
  const [name, setName] = useState("Your name here");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const url = isLogin ? "/api/auth/login" : "/api/auth/register";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        name: !name ? "" : name, // include name only if provided
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // if ok, proceed and redirect
      localStorage.setItem("@library/token", data.token);
      auth.setToken(data.token);
      router.push("/items");
      return;
    }
    setError(data.message || "Something went wrong, try again"); // get error msg from api response
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {isLogin ? "Login" : "Register"}
      </h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            className="mt-1 block w-full p-2 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            className="mt-1 block w-full p-2 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              className="mt-1 block w-full p-2 text-gray-800 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>
        )}

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="text-center text-gray-500 mt-4">or</p>

        <button
          type="button"
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300"
          onClick={(e) => {
            setIsLogin(!isLogin);
          }}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;

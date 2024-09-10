"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";

function AuthForm() {
  const router = useRouter();
  const auth = useAuth();

  const [email, setEmail] = useState("abc123@mail.com");
  const [password, setPassword] = useState("abc123");
  const [name, setName] = useState("");
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
        name,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      console.log("data", data);
      localStorage.setItem("@library/token", data.token);
      auth.setToken(data.token);
      router.push("/items");
      return;
    }
    setError("Invalid login credentials");
  }

  console.log("Auth", auth);

  return (
    <div>
      AuthForm
      <form className="form bg-white" onSubmit={handleSubmit}>
        <div className="form__group">
          <label className="form__label text-gray-800">Email</label>
          <input
            className="form__input"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          ></input>
        </div>
        <div className="form__group">
          <label className="form__label text-gray-800">Password</label>
          <input
            className="form__input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          ></input>
        </div>
        {!isLogin && (
          <div className="form__group">
            <label className="form__label text-gray-800">Name</label>
            <input
              className="form__input"
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            ></input>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button className="form__button form__button--primary">
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="form__text">...or</p>
        <div className="form__group">
          <button
            className="form__button form__button--secondary"
            type="button"
            onClick={(e) => {
              setIsLogin(!isLogin);
            }}
          >
            {!isLogin ? "Login" : "Register"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AuthForm;

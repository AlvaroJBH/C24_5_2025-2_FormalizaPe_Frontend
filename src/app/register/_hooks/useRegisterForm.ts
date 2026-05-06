"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export function useRegisterForm() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [dni, setDni] = useState("");
  const [ruc, setRuc] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);
    try {
      const token = await register({ username, email, password, dni, ruc });
      setToken(token);
      router.push("/businesses");
    } catch (err) {
      console.error(err);
      setError("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    dni,
    setDni,
    ruc,
    setRuc,
    loading,
    error,
    handleSubmit,
  };
}
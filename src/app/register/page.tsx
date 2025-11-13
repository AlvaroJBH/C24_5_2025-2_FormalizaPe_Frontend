"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { register } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";

export default function RegisterPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);

  const [username, setUsername] = useState(""); // Nombre de empresa
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
      router.push("/dashboard");
    } catch (err) {
      setError("Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-md relative text-center">
        {/* Volver */}
        <Link
          href="/"
          className="absolute top-4 left-6 text-blue-600 text-sm font-medium hover:underline"
        >
          ← Volver
        </Link>

        {/* Logo */}
        <div className="w-20 h-20 bg-linear-to-br from-blue-800 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-10 h-10 text-white"
          >
            <path d="M10 12h4" />
            <path d="M10 8h4" />
            <path d="M14 21v-3a2 2 0 0 0-4 0v3" />
            <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2" />
            <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16" />
          </svg>
        </div>

        <h2 className="text-2xl font-semibold text-blue-700 mb-1">
          Crear cuenta
        </h2>
        <p className="text-gray-500 mb-6">
          Regístrate para comenzar la formalización
        </p>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
          <div>
            <Label htmlFor="username" className="text-gray-800 text-sm">
              Nombre de empresa
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="Mi empresa SAC"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-800 text-sm">
              Correo electrónico
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-800 text-sm">
              Contraseña
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-gray-800 text-sm">
              Confirmar contraseña
            </Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="dni" className="text-gray-800 text-sm">
              DNI
            </Label>
            <Input
              type="text"
              id="dni"
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="ruc" className="text-gray-800 text-sm">
              RUC
            </Label>
            <Input
              type="text"
              id="ruc"
              placeholder="20123456789"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <GradientButton type="submit" className="w-full mt-4" disabled={loading}>
            {loading ? "Cargando..." : "Crear cuenta"}
          </GradientButton>
        </form>

        <div className="mt-6">
          <p className="text-blue-600 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="underline hover:opacity-80">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

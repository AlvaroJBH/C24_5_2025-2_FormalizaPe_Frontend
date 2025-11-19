"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { login } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = await login(email, password);
      setToken(token);
      router.push("/businesses");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-none shadow-xl border border-gray-300 p-10 w-full max-w-md relative text-center">

        {/* Volver */}
        <Link
          href="/"
          className="absolute top-4 left-4 text-blue-700 text-sm font-medium hover:underline"
        >
          ← Volver
        </Link>

        {/* Logo */}
        <div className="w-20 h-20 bg-linear-to-br from-blue-800 to-blue-600 rounded-none mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/icono formalizape.ico"
            width={64}
            height={64}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-blue-800 mb-1">
          Iniciar Sesión
        </h2>
        <p className="text-gray-600 mb-6">
          Accede a tu cuenta para gestionar tu negocio
        </p>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="text-left space-y-5">

          {/* Email */}
          <div>
            <Label htmlFor="email" className="text-gray-700 text-sm">
              Correo electrónico
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
              required
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-gray-700 text-sm">
              Contraseña
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          )}

          {/* Botón */}
          <GradientButton
            type="submit"
            className="w-full mt-4 rounded-none text-white font-semibold"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </GradientButton>
        </form>

        {/* Links secundarios */}
        <div className="mt-6 space-y-2">
          <p className="text-blue-700 text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="underline hover:opacity-80">
              Regístrate
            </Link>
          </p>

          <p className="text-gray-600 text-sm">
            <Link
              href="/forgot-password"
              className="hover:text-blue-700 transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

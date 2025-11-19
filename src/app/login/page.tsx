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
      setError("Credenciales inválidas o error al iniciar sesión");
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
          <Image
            src="/icono formalizape.ico"
            width={24}
            height={24}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
        </div>

        <h2 className="text-2xl font-semibold text-blue-700 mb-1">
          Iniciar Sesión
        </h2>
        <p className="text-gray-500 mb-6">
          Accede a tu cuenta para gestionar tu negocio
        </p>

        <form onSubmit={handleSubmit} className="text-left space-y-4">
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

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <GradientButton
            type="submit"
            className="w-full mt-4"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión"}
          </GradientButton>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-blue-600 text-sm">
            ¿No tienes cuenta?{" "}
            <Link href="/register" className="underline hover:opacity-80">
              Regístrate
            </Link>
          </p>
          <p className="text-gray-500 text-sm">
            <Link
              href="/forgot-password"
              className="hover:text-blue-600 transition"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

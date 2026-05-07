"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { login, getCurrentUser } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

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

      const user = await getCurrentUser(token);
      setUser(user);

      router.push("/admin/home");
    } catch (err) {
      console.error(err);
      setError("Credenciales inválidas o error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-linear-to-b from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="bg-white rounded-none shadow-xl border border-gray-300 p-10 w-full max-w-md relative text-center">
        <Link
          href="/"
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700 text-sm"
        >
          ← Volver
        </Link>

        <div className="w-16 h-16 bg-linear-to-br from-gray-800 to-gray-600 rounded-none mx-auto mb-4 flex items-center justify-center">
          <Image
            src="/icono formalizape.ico"
            width={40}
            height={40}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Panel de Admin</h1>
        <p className="text-gray-500 text-sm mb-8">Ingresa tus credenciales de administrador</p>

        <form onSubmit={handleSubmit} className="text-left space-y-5">
          <div>
            <Label htmlFor="email" className="text-gray-700 text-sm">
              Correo electrónico
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="admin@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-gray-800"
              required
            />
          </div>

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
              className="rounded-none border-gray-400 focus-visible:ring-gray-800"
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm font-medium">
              {error}
            </p>
          )}

          <GradientButton
            type="submit"
            className="w-full mt-4 rounded-none text-white font-semibold bg-gray-800 hover:bg-gray-900"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Iniciar sesión como Admin"}
          </GradientButton>
        </form>
      </div>
    </main>
  );
}
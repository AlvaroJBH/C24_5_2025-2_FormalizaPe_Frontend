"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { register } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import Image from "next/image";

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
      router.push("/businesses");
    } catch (err) {
      console.error(err);
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
          <Image
            src="/icono formalizape.ico"
            width={24}
            height={24}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
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
              Nombre
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="John Doe"
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

          <GradientButton
            type="submit"
            className="w-full mt-4"
            disabled={loading}
          >
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

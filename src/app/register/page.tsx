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
          Crear cuenta
        </h2>
        <p className="text-gray-600 mb-6">
          Regístrate para comenzar la formalización
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="text-left space-y-5">

          <div>
            <Label htmlFor="username" className="text-gray-700 text-sm">
              Nombre
            </Label>
            <Input
              type="text"
              id="username"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
              required
            />
          </div>

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

          <div>
            <Label htmlFor="confirm-password" className="text-gray-700 text-sm">
              Confirmar contraseña
            </Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
              required
            />
          </div>

          <div>
            <Label htmlFor="dni" className="text-gray-700 text-sm">
              DNI
            </Label>
            <Input
              type="text"
              id="dni"
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
              required
            />
          </div>

          <div>
            <Label htmlFor="ruc" className="text-gray-700 text-sm">
              RUC
            </Label>
            <Input
              type="text"
              id="ruc"
              placeholder="20123456789"
              value={ruc}
              onChange={(e) => setRuc(e.target.value)}
              className="rounded-none border-gray-400 focus-visible:ring-blue-700"
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
            className="w-full mt-4 rounded-none"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Crear cuenta"}
          </GradientButton>
        </form>

        {/* Link login */}
        <div className="mt-6">
          <p className="text-blue-700 text-sm">
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

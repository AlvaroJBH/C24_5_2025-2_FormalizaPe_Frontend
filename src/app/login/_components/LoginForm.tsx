"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { login } from "@/services/auth-service";
import { useAuthStore } from "@/store/auth-store";
import { useRouter } from "next/navigation";

export function LoginForm() {
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
    <form onSubmit={handleSubmit} className="text-left space-y-5">
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

      {error && (
        <p className="text-red-600 text-sm font-medium">
          {error}
        </p>
      )}

      <GradientButton
        type="submit"
        className="w-full mt-4 rounded-none text-white font-semibold"
        disabled={loading}
      >
        {loading ? "Cargando..." : "Iniciar sesión"}
      </GradientButton>
    </form>
  );
}
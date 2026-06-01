"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/common/gradient-button";
import { useRegisterForm } from "../_hooks/useRegisterForm";

export function RegisterForm() {
  const {
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
    success,
    handleSubmit,
  } = useRegisterForm();

  return (
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
          disabled={success}
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
          disabled={success}
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
          disabled={success}
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
          disabled={success}
          required
        />
      </div>

      <div>
        <Label htmlFor="dni" className="text-gray-700 text-sm">
          DNI (opcional)
        </Label>
        <Input
          type="text"
          id="dni"
          placeholder="12345678"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="rounded-none border-gray-400 focus-visible:ring-blue-700"
          disabled={success}
        />
      </div>

      <div>
        <Label htmlFor="ruc" className="text-gray-700 text-sm">
          RUC (opcional)
        </Label>
        <Input
          type="text"
          id="ruc"
          placeholder="20123456789"
          value={ruc}
          onChange={(e) => setRuc(e.target.value)}
          className="rounded-none border-gray-400 focus-visible:ring-blue-700"
          disabled={success}
        />
      </div>

      {error && (
        <p className="text-red-600 text-sm font-medium">
          {error}
        </p>
      )}

      {success && (
        <p className="text-green-600 text-sm font-medium">
          ¡Cuenta creada! Redirigiendo al login...
        </p>
      )}

      <GradientButton
        type="submit"
        className="w-full mt-4 rounded-none"
        disabled={loading || success}
      >
        {loading ? "Creando..." : success ? "Cuenta creada" : "Crear cuenta"}
      </GradientButton>
    </form>
  );
}
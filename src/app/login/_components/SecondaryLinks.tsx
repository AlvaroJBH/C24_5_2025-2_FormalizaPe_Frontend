import Link from "next/link";

export function SecondaryLinks() {
  return (
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
  );
}
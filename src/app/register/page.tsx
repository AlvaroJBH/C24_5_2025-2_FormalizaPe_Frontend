"use client";

import Link from "next/link";
import Image from "next/image";
import { RegisterForm } from "./_components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">

      <div className="bg-white rounded-none shadow-xl border border-gray-300 p-10 w-full max-w-md relative text-center">

        <Link
          href="/"
          className="absolute top-4 left-4 text-blue-700 text-sm font-medium hover:underline"
        >
          ← Volver
        </Link>

        <div className="w-20 h-20 bg-linear-to-br from-blue-800 to-blue-600 rounded-none mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/icono formalizape.ico"
            width={64}
            height={64}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
        </div>

        <h2 className="text-2xl font-semibold text-blue-800 mb-1">
          Crear cuenta
        </h2>
        <p className="text-gray-600 mb-6">
          Regístrate para comenzar la formalización
        </p>

        <RegisterForm />

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
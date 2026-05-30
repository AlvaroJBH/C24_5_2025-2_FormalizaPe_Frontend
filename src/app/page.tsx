"use client";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-none shadow-xl border border-gray-300 p-10 max-w-3xl w-full text-center">

        {/* Logo */}
        <div className="w-24 h-24 bg-linear-to-br from-blue-800 to-blue-600 rounded-none mx-auto mb-6 flex items-center justify-center">
          <Image
            src="/icono formalizape.ico"
            width={64}
            height={64}
            alt="Icono Formalizape"
            className="w-full h-full"
          />
        </div>

        {/* Títulos */}
        <h1 className="text-3xl font-bold text-blue-800 mb-1">Formaliza.pe</h1>
        <p className="text-gray-700 mb-1">
          Tu plataforma para formalizar negocios en el Perú
        </p>
        <p className="text-blue-700 font-medium mb-10">
          Formaliza tu negocio de manera fácil y rápida
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Card 1 */}
          <div className="bg-white border border-gray-300 rounded-none p-6 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-700 mb-4 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
            </svg>
            <h3 className="text-blue-800 font-semibold">Asistencia con IA</h3>
            <p className="text-gray-600 text-sm">
              Chatbot inteligente que te guía paso a paso
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-gray-300 rounded-none p-6 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-700 mb-4 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
            </svg>
            <h3 className="text-blue-800 font-semibold">Trámites Seguros</h3>
            <p className="text-gray-600 text-sm">
              Gestiona todos tus trámites de formalización
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-gray-300 rounded-none p-6 shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10 text-blue-700 mb-4 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="current"
            >
              <path d="M16 7h6v6" />
              <path d="m22 7-8.5 8.5-5-5L2 17" />
            </svg>
            <h3 className="text-blue-800 font-semibold">
              Simulador Tributario
            </h3>
            <p className="text-gray-600 text-sm">
              Calcula impuestos y encuentra el mejor régimen
            </p>
          </div>
        </div>

        {/* Botón principal */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
          <Link
            href="/login"
            className="inline-block bg-linear-to-r from-blue-700 to-blue-600 text-white font-semibold py-3 px-8 rounded-none shadow-lg border border-blue-900/30 hover:opacity-90 transition"
          >
            Comenzar ahora
          </Link>

          <Link
            href="/admin/login"
            className="inline-block bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 px-8 rounded-none shadow-lg border border-gray-900/30 transition"
          >
            Admin
          </Link>
        </div>

        {/* Footer */}
        <p className="text-gray-500 text-sm mt-6">
          Únete a miles de emprendedores que ya formalizaron su negocio.
        </p>
      </div>
    </main>
  );
}
"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-3xl w-full text-center">
        {/* Logo */}
        <div className="w-24 h-24 bg-linear-to-br from-blue-800 to-blue-600 rounded-2xl mx-auto mb-6 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-12 h-12 text-white"
          >
            <path d="M10 12h4"></path>
            <path d="M10 8h4"></path>
            <path d="M14 21v-3a2 2 0 0 0-4 0v3"></path>
            <path d="M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"></path>
            <path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
          </svg>
        </div>

        {/* Textos */}
        <h1 className="text-3xl font-bold text-blue-700 mb-2">Formaliza.pe</h1>
        <p className="text-gray-700 mb-1">
          Tu plataforma para formalizar negocios en el Perú
        </p>
        <p className="text-blue-600 font-medium mb-8">
          Formaliza tu negocio de manera fácil y rápida
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-blue-600 mb-3 mx-auto"
            >
              <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"></path>
            </svg>
            <h3 className="text-blue-700 font-semibold">Asistencia con IA</h3>
            <p className="text-gray-600 text-sm">
              Chatbot inteligente que te guía paso a paso
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-blue-600 mb-3 mx-auto"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
            </svg>
            <h3 className="text-blue-700 font-semibold">Trámites Seguros</h3>
            <p className="text-gray-600 text-sm">
              Gestiona todos tus trámites de formalización
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-6 shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-8 h-8 text-blue-600 mb-3 mx-auto"
            >
              <path d="M16 7h6v6"></path>
              <path d="m22 7-8.5 8.5-5-5L2 17"></path>
            </svg>
            <h3 className="text-blue-700 font-semibold">
              Simulador Tributario
            </h3>
            <p className="text-gray-600 text-sm">
              Calcula impuestos y encuentra el mejor régimen
            </p>
          </div>
        </div>

        {/* Botón principal */}
        <Link
          href="/login"
          className="inline-block bg-linear-to-r from-blue-700 to-blue-500 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:opacity-90 transition"
        >
          Comenzar ahora
        </Link>

        {/* Texto final */}
        <p className="text-gray-500 text-sm mt-6">
          Únete a miles de emprendedores que ya formalizaron su negocio
        </p>
      </div>
    </main>
  );
}

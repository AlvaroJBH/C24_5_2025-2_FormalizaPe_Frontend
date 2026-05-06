"use client";

import { BackLink } from "./_components/BackLink";
import { LogoSection } from "./_components/LogoSection";
import { LoginHeader } from "./_components/LoginHeader";
import { LoginForm } from "./_components/LoginForm";
import { SecondaryLinks } from "./_components/SecondaryLinks";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen bg-linear-to-b from-blue-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-none shadow-xl border border-gray-300 p-10 w-full max-w-md relative text-center">
        <BackLink />
        <LogoSection />
        <LoginHeader />
        <LoginForm />
        <SecondaryLinks />
      </div>
    </main>
  );
}
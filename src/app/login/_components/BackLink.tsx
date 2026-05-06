import Link from "next/link";

export function BackLink() {
  return (
    <Link
      href="/"
      className="absolute top-4 left-4 text-blue-700 text-sm font-medium hover:underline"
    >
      ← Volver
    </Link>
  );
}
import Image from "next/image";

export function LogoSection() {
  return (
    <div className="w-20 h-20 bg-linear-to-br from-blue-800 to-blue-600 rounded-none mx-auto mb-6 flex items-center justify-center">
      <Image
        src="/icono formalizape.ico"
        width={64}
        height={64}
        alt="Icono Formalizape"
        className="w-full h-full"
      />
    </div>
  );
}
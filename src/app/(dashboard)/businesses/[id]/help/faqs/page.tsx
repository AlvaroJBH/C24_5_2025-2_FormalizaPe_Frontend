"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { FaqCategory, getFaqs } from "@/services/faq-service";
import clsx from "clsx";
import { Business, getBusinessById } from "@/services/business-service";
import { AppBreadcrumb } from "@/components/common/app-breadcrumb";

export default function FaqPageClient() {
  const { id } = useParams();
  const businessId = Number(id);
  const [business, setBusiness] = useState<Business | null>(null)

  const router = useRouter();
  const [faqs, setFaqs] = useState<FaqCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getFaqs();
        setFaqs(data);
        const business_data = await getBusinessById(businessId);
        setBusiness(business_data)
        if (data.length > 0) setSelectedCategory(data[0].category);
      } catch (err) {
        console.error(err);
        setError("Error al cargar las preguntas frecuentes");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p className="p-6 text-gray-500">Cargando FAQs...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  const activeCategory = faqs.find((f) => f.category === selectedCategory);

  return (
    <div className="flex flex-col flex-1 p-6 overflow-auto">
      <AppBreadcrumb
        items={[
          { label: "Inicio", href: "/businesses" },
          { label: business?.tradeName ?? "Business", href: `/businesses/${businessId}` },
          { label: "QAs", href: `/businesses/${businessId}/help/faqs` }
        ]}
      />
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl text-slate-700 font-semibold">
          Preguntas frecuentes
        </h1>

        <Button
          className="bg-slate-700 hover:bg-slate-800 text-white rounded-none shadow-sm"
          onClick={() => router.push("../help/chatbot")}
        >
          Hablar con el asistente
        </Button>
      </div>

      {/* ================= BODY ================= */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* -------- Categorías -------- */}
        <aside className="md:col-span-1">
          <ul className="space-y-2">
            {faqs.map((cat) => (
              <li key={cat.category}>
                <button
                  onClick={() => setSelectedCategory(cat.category)}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm rounded-none border",
                    selectedCategory === cat.category
                      ? "bg-slate-700 text-white border-slate-700"
                      : "bg-white text-slate-700 border-gray-300 hover:bg-gray-100"
                  )}
                >
                  {cat.category}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* -------- Preguntas -------- */}
        <section className="md:col-span-3 bg-white border-black">
          {activeCategory ? (
            <Accordion type="single" collapsible className="space-y-3 border border-gray-300">
              {activeCategory.questions.map((q) => (
                <AccordionItem
                  key={q.id}
                  value={q.id.toString()}
                  className="border-none"
                >
                  <AccordionTrigger className="px-4 py-3 text-slate-800 font-medium hover:no-underline">
                    {q.questionTitle}
                  </AccordionTrigger>

                  <AccordionContent className="px-4 pb-4 text-gray-600 text-sm">
                    {q.response}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <p className="text-gray-500">
              Selecciona una categoría para ver las preguntas.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
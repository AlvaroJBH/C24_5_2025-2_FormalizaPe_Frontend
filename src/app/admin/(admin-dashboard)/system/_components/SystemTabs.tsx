import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaqPanel } from "./FaqPanel";
import { ChatbotPanel } from "./ChatbotPanel";
import { MetricsPanel } from "./MetricsPanel";

export function SystemTabs({ className = "" }: { className?: string }) {
  return (
    <Tabs defaultValue="faq" className={`w-full flex flex-col flex-1 ${className}`}>
      <TabsList className="bg-gray-100 border border-gray-300 mb-4">
        <TabsTrigger value="faq" className="data-[state=active]:bg-gray-200">
          FAQ
        </TabsTrigger>
        <TabsTrigger value="chatbot" className="data-[state=active]:bg-gray-200">
          Chatbot
        </TabsTrigger>
        <TabsTrigger value="metrics" className="data-[state=active]:bg-gray-200">
          Métricas
        </TabsTrigger>
      </TabsList>

      <TabsContent value="faq" className="overflow-auto">
        <FaqPanel />
      </TabsContent>

      <TabsContent value="chatbot" className="overflow-auto">
        <ChatbotPanel />
      </TabsContent>

      <TabsContent value="metrics" className="overflow-auto">
        <MetricsPanel />
      </TabsContent>
    </Tabs>
  );
}
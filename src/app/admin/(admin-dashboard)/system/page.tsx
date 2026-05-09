import { SystemTabs } from "./_components/SystemTabs";

export default function SystemPage() {
  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sistema</h1>
      <SystemTabs className="flex-1"/>
    </div>
  );
}
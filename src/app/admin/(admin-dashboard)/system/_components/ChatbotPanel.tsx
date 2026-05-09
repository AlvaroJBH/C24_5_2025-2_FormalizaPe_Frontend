export function ChatbotPanel() {
  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Gestión del Chatbot</h2>
      <p className="text-gray-600 mb-4">
        En esta sección se administrarán los documentos base y fuentes de conocimiento del chatbot.
      </p>
      <ul className="space-y-2 text-gray-500 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Documentos base del chatbot</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Fuentes de conocimiento</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Reentrenamiento e indexación (conceptual)</span>
        </li>
      </ul>
    </div>
  );
}
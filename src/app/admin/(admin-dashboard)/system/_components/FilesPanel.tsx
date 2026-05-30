export function FilesPanel() {
  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Gestión de Archivos</h2>
      <p className="text-gray-600 mb-4">
        En esta sección se administrarán los archivos del sistema y documentos subidos por el administrador.
      </p>
      <ul className="space-y-2 text-gray-500 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Archivos generales del sistema</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Documentos subidos por el admin</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Asociación a módulos (FAQ, Chatbot, etc.)</span>
        </li>
      </ul>
    </div>
  );
}
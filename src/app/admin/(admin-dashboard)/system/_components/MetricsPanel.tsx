export function MetricsPanel() {
  return (
    <div className="bg-white rounded-none shadow-md border border-gray-300 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Métricas del Sistema</h2>
      <p className="text-gray-600 mb-4">
        En esta sección se visualizarán métricas e indicadores del uso del sistema.
      </p>
      <ul className="space-y-2 text-gray-500 text-sm">
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Uso general del sistema</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Interacciones de usuarios</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-gray-400">•</span>
          <span>Estadísticas y gráficos generales</span>
        </li>
      </ul>
    </div>
  );
}
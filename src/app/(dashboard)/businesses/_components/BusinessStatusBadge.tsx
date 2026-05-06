interface BusinessStatusBadgeProps {
  status: string;
}

export function BusinessStatusBadge({ status }: BusinessStatusBadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-none text-xs font-semibold
        ${status === "active"
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-700"
        }
      `}
    >
      {status}
    </span>
  );
}
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BusinessSummaryCardProps {
  title: string;
  children: React.ReactNode;
}

export function BusinessSummaryCard({ title, children }: BusinessSummaryCardProps) {
  return (
    <Card className="rounded-none border-gray-300 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold text-gray-700 uppercase">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}
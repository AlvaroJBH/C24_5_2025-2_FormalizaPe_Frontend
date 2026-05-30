import { StepFallbackModal } from "../StepFallbackModal";
import type { StepComponentProps } from "../StepFallbackModal";

export function SunatRecordTransactionsStep(props: StepComponentProps) {
  return <StepFallbackModal {...props} />;
}
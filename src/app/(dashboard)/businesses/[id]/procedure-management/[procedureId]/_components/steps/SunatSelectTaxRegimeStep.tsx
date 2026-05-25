import { StepFallbackModal } from "../StepFallbackModal";
import type { StepComponentProps } from "../StepFallbackModal";

export function SunatSelectTaxRegimeStep(props: StepComponentProps) {
  return <StepFallbackModal {...props} />;
}
import { StepFallbackModal } from "../StepFallbackModal";
import type { StepComponentProps } from "../StepFallbackModal";

export function SunatValidateSolKeyStep(props: StepComponentProps) {
  return <StepFallbackModal {...props} />;
}
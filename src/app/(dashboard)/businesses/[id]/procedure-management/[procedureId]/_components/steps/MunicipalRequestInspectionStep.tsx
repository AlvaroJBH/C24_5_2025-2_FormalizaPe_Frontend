import { StepFallbackModal } from "../StepFallbackModal";
import type { StepComponentProps } from "../StepFallbackModal";

export function MunicipalRequestInspectionStep(props: StepComponentProps) {
  return <StepFallbackModal {...props} />;
}
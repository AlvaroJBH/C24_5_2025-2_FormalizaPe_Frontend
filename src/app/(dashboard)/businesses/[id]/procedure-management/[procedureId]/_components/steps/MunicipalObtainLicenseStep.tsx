import { StepFallbackModal } from "../StepFallbackModal";
import type { StepComponentProps } from "../StepFallbackModal";

export function MunicipalObtainLicenseStep(props: StepComponentProps) {
  return <StepFallbackModal {...props} />;
}
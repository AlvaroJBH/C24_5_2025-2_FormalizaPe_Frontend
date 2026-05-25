import { StepFallbackModal } from "./StepFallbackModal";
import type { StepComponentProps } from "./StepFallbackModal";

import { SunatIdentifyTaxpayerTypeStep } from "./steps/SunatIdentifyTaxpayerTypeStep";
import { SunatSelectTaxRegimeStep } from "./steps/SunatSelectTaxRegimeStep";
import { SunatSelectCiiuStep } from "./steps/SunatSelectCiiuStep";
import { SunatRegisterRucStep } from "./steps/SunatRegisterRucStep";
import { SunatVerifyRucStatusStep } from "./steps/SunatVerifyRucStatusStep";
import { SunatValidateSolKeyStep } from "./steps/SunatValidateSolKeyStep";
import { SunatDefineVoucherTypesStep } from "./steps/SunatDefineVoucherTypesStep";
import { SunatActivateElectronicInvoicingStep } from "./steps/SunatActivateElectronicInvoicingStep";
import { SunatAuthorizeVoucherSeriesStep } from "./steps/SunatAuthorizeVoucherSeriesStep";
import { SunatEmitFirstVoucherStep } from "./steps/SunatEmitFirstVoucherStep";
import { SunarpEvaluateLegalEntityNeedStep } from "./steps/SunarpEvaluateLegalEntityNeedStep";
import { SunarpReserveCompanyNameStep } from "./steps/SunarpReserveCompanyNameStep";
import { SunarpDraftMinuteAndStatuteStep } from "./steps/SunarpDraftMinuteAndStatuteStep";
import { SunarpExecutePublicDeedStep } from "./steps/SunarpExecutePublicDeedStep";
import { SunarpRegisterCompanyStep } from "./steps/SunarpRegisterCompanyStep";
import { MunicipalEvaluateLicenseRequirementStep } from "./steps/MunicipalEvaluateLicenseRequirementStep";
import { MunicipalVerifyZoningStep } from "./steps/MunicipalVerifyZoningStep";
import { MunicipalPrepareDocumentationStep } from "./steps/MunicipalPrepareDocumentationStep";
import { MunicipalRequestInspectionStep } from "./steps/MunicipalRequestInspectionStep";
import { MunicipalObtainLicenseStep } from "./steps/MunicipalObtainLicenseStep";
import { SunatDeclareEmployerStep } from "./steps/SunatDeclareEmployerStep";
import { SunatRegisterWorkersStep } from "./steps/SunatRegisterWorkersStep";
import { SunatActivatePayrollStep } from "./steps/SunatActivatePayrollStep";
import { SunatFulfillLaborObligationsStep } from "./steps/SunatFulfillLaborObligationsStep";
import { EsSaludLinkFromPayrollStep } from "./steps/EsSaludLinkFromPayrollStep";
import { EsSaludVerifyInsuredWorkersStep } from "./steps/EsSaludVerifyInsuredWorkersStep";
import { EsSaludConfirmActiveCoverageStep } from "./steps/EsSaludConfirmActiveCoverageStep";
import { SunatIdentifyAccountingObligationStep } from "./steps/SunatIdentifyAccountingObligationStep";
import { SunatActivateElectronicBooksStep } from "./steps/SunatActivateElectronicBooksStep";
import { SunatRecordTransactionsStep } from "./steps/SunatRecordTransactionsStep";
import { SunatSubmitMonthlyBooksStep } from "./steps/SunatSubmitMonthlyBooksStep";

export const stepComponentMap: Record<string, React.FC<StepComponentProps>> = {
  SUNAT_IDENTIFY_TAXPAYER_TYPE: SunatIdentifyTaxpayerTypeStep,
  SUNAT_SELECT_TAX_REGIME: SunatSelectTaxRegimeStep,
  SUNAT_SELECT_CIIU: SunatSelectCiiuStep,
  SUNAT_REGISTER_RUC: SunatRegisterRucStep,
  SUNAT_VERIFY_RUC_STATUS: SunatVerifyRucStatusStep,
  SUNAT_VALIDATE_SOL_KEY: SunatValidateSolKeyStep,
  SUNAT_DEFINE_VOUCHER_TYPES: SunatDefineVoucherTypesStep,
  SUNAT_ACTIVATE_ELECTRONIC_INVOICING: SunatActivateElectronicInvoicingStep,
  SUNAT_AUTHORIZE_VOUCHER_SERIES: SunatAuthorizeVoucherSeriesStep,
  SUNAT_EMIT_FIRST_VOUCHER: SunatEmitFirstVoucherStep,
  SUNARP_EVALUATE_LEGAL_ENTITY_NEED: SunarpEvaluateLegalEntityNeedStep,
  SUNARP_RESERVE_COMPANY_NAME: SunarpReserveCompanyNameStep,
  SUNARP_DRAFT_MINUTE_AND_STATUTE: SunarpDraftMinuteAndStatuteStep,
  SUNARP_EXECUTE_PUBLIC_DEED: SunarpExecutePublicDeedStep,
  SUNARP_REGISTER_COMPANY: SunarpRegisterCompanyStep,
  MUNICIPAL_EVALUATE_LICENSE_REQUIREMENT: MunicipalEvaluateLicenseRequirementStep,
  MUNICIPAL_VERIFY_ZONING: MunicipalVerifyZoningStep,
  MUNICIPAL_PREPARE_DOCUMENTATION: MunicipalPrepareDocumentationStep,
  MUNICIPAL_REQUEST_INSPECTION: MunicipalRequestInspectionStep,
  MUNICIPAL_OBTAIN_LICENSE: MunicipalObtainLicenseStep,
  SUNAT_DECLARE_EMPLOYER: SunatDeclareEmployerStep,
  SUNAT_REGISTER_WORKERS: SunatRegisterWorkersStep,
  SUNAT_ACTIVATE_PAYROLL: SunatActivatePayrollStep,
  SUNAT_FULFILL_LABOR_OBLIGATIONS: SunatFulfillLaborObligationsStep,
  ESSALUD_LINK_FROM_PAYROLL: EsSaludLinkFromPayrollStep,
  ESSALUD_VERIFY_INSURED_WORKERS: EsSaludVerifyInsuredWorkersStep,
  ESSALUD_CONFIRM_ACTIVE_COVERAGE: EsSaludConfirmActiveCoverageStep,
  SUNAT_IDENTIFY_ACCOUNTING_OBLIGATION: SunatIdentifyAccountingObligationStep,
  SUNAT_ACTIVATE_ELECTRONIC_BOOKS: SunatActivateElectronicBooksStep,
  SUNAT_RECORD_TRANSACTIONS: SunatRecordTransactionsStep,
  SUNAT_SUBMIT_MONTHLY_BOOKS: SunatSubmitMonthlyBooksStep,
};

export function getStepComponent(identifier: string): React.FC<StepComponentProps> {
  return stepComponentMap[identifier] || StepFallbackModal;
}
export enum PrescriptionStatus {
  PendingVerification = 0,
  Submitted = 1,
  UnderReview = 2,
  PartiallyApproved = 3,
  Approved = 4,
  Rejected = 5,
  Exhausted = 6,
  Expired = 7,
}

export enum PrescriptionItemStatus {
  PendingReview = 0,
  Approved = 1,
  Substituted = 2,
  Unavailable = 3
}

export interface PrescriptionItemDto {
  id: string;
  prescriptionId: string;
  productId: string;
  productName?: string;
  requestedQty: number;
  availableStock?: number;
}

export interface PrescriptionItemDecision {
  productId: string;
  authorizedQty: number;
  decision: PrescriptionItemStatus;
  substituteProductId?: string | null;
}

export interface PendingPrescriptionDto {
  id: string;
  customerId: string;
  fullName: string;
  cellphoneNumber: string;
  email: string;
  nationalIdOrPatientNumber: string | null;
  insuranceNumber?: string | null;
  patientDateOfBirth: string | null;
  doctorName: string;
  doctorId?: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  status: PrescriptionStatus;
  documentBlobPath?: string | null;
  createdAt?: string | null;
}

export interface ApprovePrescriptionRequest {
  prescriptionId: string;
  pharmacistUserId: string;
  itemDecisions: PrescriptionItemDecision[];
}

export enum RejectionReason {
        ExpiredPrescription = 0,
        IllegiblePrescription = 1,
        UnavailableMedication = 2,
        InvalidPrescriber = 3
}

export interface RejectPrescriptionRequest {
  prescriptionId: string;
  pharmacistUserId: string;
  reason: RejectionReason;
  notes?: string | null;
}

export interface TranscribePrescriptionDetailsRequest {
  prescriptionId: string;
  pharmacistUserId: string;
  nationalIdOrPatientNumber: string;
  patientDateOfBirth: string; 
  issueDate: string;          
  expiryDate: string;        
}

export interface TranscribePrescriptionDetailsResponse {
  isSuccess: boolean;
}

export interface GetPendingPrescriptionsParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface GetPendingPrescriptionsResponse {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: PendingPrescriptionDto[];
}

export interface GetPrescriptionByIdResponse {
  prescriptionRequest: PendingPrescriptionDto;
}

export interface ApprovePrescriptionResponse {
  isSuccess: boolean;
}

export interface RejectPrescriptionResponse {
  isSuccess: boolean;
}

export interface SearchPrescriptionProductsParams {
  query: string;
}

export interface PrescriptionProductSearchResult {
  productId: string;
  name: string;
  sku?: string;
  availableQuantity: number;
  isAvailable: boolean;
}

export type SearchPrescriptionProductsResponse = PrescriptionProductSearchResult[];

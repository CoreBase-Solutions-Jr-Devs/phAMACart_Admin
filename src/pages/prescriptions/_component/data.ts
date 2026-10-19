import { PrescriptionProductSearchResult } from "@/features/prescriptions/prescriptionsType";

export const mockProducts: PrescriptionProductSearchResult[] = [
  { productId: "p-001", name: "Paracetamol 500mg", sku: "PARA-500", availableQuantity: 120, isAvailable: true },
  { productId: "p-002", name: "Amoxicillin 250mg", sku: "AMOX-250", availableQuantity: 0, isAvailable: false },
  { productId: "p-003", name: "Ibuprofen 200mg", sku: "IBU-200", availableQuantity: 45, isAvailable: true },
  { productId: "p-004", name: "Metformin 500mg", sku: "MET-500", availableQuantity: 8, isAvailable: true },
  { productId: "p-005", name: "Amlodipine 5mg", sku: "AMLO-5", availableQuantity: 60, isAvailable: true },
  { productId: "p-006", name: "Omeprazole 20mg", sku: "OMEP-20", availableQuantity: 0, isAvailable: false },
  { productId: "p-007", name: "Cetirizine 10mg", sku: "CETI-10", availableQuantity: 200, isAvailable: true },
  { productId: "p-008", name: "Azithromycin 500mg", sku: "AZI-500", availableQuantity: 15, isAvailable: true },
  { productId: "p-009", name: "Losartan 50mg", sku: "LOSA-50", availableQuantity: 30, isAvailable: true },
  { productId: "p-010", name: "Salbutamol Inhaler 100mcg", sku: "SALB-100", availableQuantity: 0, isAvailable: false },
];
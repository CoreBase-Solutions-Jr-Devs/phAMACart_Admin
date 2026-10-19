export interface Brand {
  id: string;
  name: string;
  brandImageUrl: string;
  description: string;
  isActive: boolean;
  productCount: number;
  children?: Brand[];
}

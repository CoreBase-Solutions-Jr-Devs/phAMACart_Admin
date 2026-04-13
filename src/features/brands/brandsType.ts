export interface Brand {
  id: string;
  name: string;
  brandImageUrl: string;
  isActive: boolean;
  productCount: number;
  children?: Brand[];
}

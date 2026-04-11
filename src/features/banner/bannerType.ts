export interface Banner {
  id?: number;
  Title: string;
  SortOrder: string;
  Type: string;
  StartDate: string;
  EndDate: string;
  companyProfileId: string;
  imageUrl?: string;
  children?: Banner[];
}

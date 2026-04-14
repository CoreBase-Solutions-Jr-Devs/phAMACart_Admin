export interface Banner {
  id?: string;
  Title: string;
  SortOrder: number;
  Type: string;
  StartDate: Date;
  EndDate: Date;
  companyProfileId: string;
  imageUrl?: string;
  ImageFile?: File[] | null;
  children?: Banner[];
}

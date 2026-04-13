export interface Banner {
  id?: number;
  Title: string;
  SortOrder: number;
  Type: number;
  StartDate: Date;
  EndDate: Date;
  companyProfileId: string;
  imageUrl?: File[];
  ImageFile?: File[];
  children?: Banner[];
}

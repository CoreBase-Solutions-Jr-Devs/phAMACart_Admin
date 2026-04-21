export interface Banner {
  id?: string;
  title: string;
  sortOrder: number;
  type: string | number;

  startDate?: Date | string;
  endDate?: Date | string;

  companyProfileId?: string;
  imageUrl?: string;

  imageFile?: File[] | null;
}
export interface NotificationDto {
  id: string;
  userId: string;
  title: string;
  message: string;
  referenceId?: string | null;
  createdAt: string;
  isRead: boolean;
}

export interface PaginatedNotifications {
  pageIndex: number;
  pageSize: number;
  count: number;
  data: NotificationDto[];
}
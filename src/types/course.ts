export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  courseLevels: string[];
  tags: string[];
  ratingAverage: string;
  ratingCount: string;
}

export interface CourseResponse {
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  courses: Course[];
}

export interface CourseFilters {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
}
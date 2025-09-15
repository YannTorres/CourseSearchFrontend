export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  courseLevels: string[];
  tags: string[];
  ratingAverage: string;
  ratingCount: string;
  // API properties
  courseUrl?: string;
  imageUrl?: string;
  durationInMinutes?: number;
  updatedAt?: string;
  // Frontend-only properties
  syllabus?: Array<{
    title: string;
    lessons: Array<{
      title: string;
      duration: string;
      completed?: boolean;
    }>;
  }>;
  requirements?: string[];
  instructor?: {
    name: string;
    bio: string;
    avatar?: string;
  };
  price?: string;
  students?: number;
  category?: string;
  whatYoullLearn?: string[];
  platformUrl?: string;
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
  sortby?: string;
  sortOrder?: string;
}

export interface CourseReview {
  rating: number;
  review: string;
  userName: string;
  updateAt: string;
}

export interface SimilarCourse {
  id: string;
  title: string;
  ratingAverage: string;
  ratingCount: string;
}

export interface SimilarCoursesResponse {
  similarCourses: SimilarCourse[];
}
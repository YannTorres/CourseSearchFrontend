import { CourseResponse, CourseFilters, Course } from '@/types/course';

const API_BASE_URL = 'https://localhost:7236/api';

export const courseService = {
  async getCourses(filters: CourseFilters = {}): Promise<CourseResponse> {
    const params = new URLSearchParams();
    
    if (filters.pageNumber) {
      params.append('pageNumber', filters.pageNumber.toString());
    }
    if (filters.pageSize) {
      params.append('pageSize', filters.pageSize.toString());
    }
    if (filters.search) {
      params.append('search', filters.search);
    }
    if (filters.sortby) {
      params.append('sortby', filters.sortby);
    }
    if (filters.sortOrder) {
      params.append('sortOrder', filters.sortOrder);
    }

    const response = await fetch(`${API_BASE_URL}/course?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    return response.json();
  },

  async getCourseById(id: string): Promise<Course> {
    const response = await fetch(`${API_BASE_URL}/course/${id}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch course');
    }
    
    return response.json();
  }
};
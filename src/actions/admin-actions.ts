'use server';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface AdminOverviewResponse {
  success: boolean;
  message: string;
  data: {
    totalUsers: number;
    totalParents: number;
    totalStudents: number;
    totalTeachers: number;
    totalAdministrators: number;
    totalQuestions: number;
    totalChildQuestions: number;
    totalTeacherQuestions: number;
    totalTips: number;
    totalFiles: number;
    totalAssessments: number;
    averageOverallScore: number | null;
    latestAssessmentAt: string | null;
  };
}

export interface AdminUsersResponse {
  success: boolean;
  message: string;
  data: {
    data: Array<{
      id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AdminUsersData {
  users: AdminUsersResponse['data']['data'];
  pagination: AdminUsersResponse['data']['pagination'];
}

export interface AdminAssessmentsResponse {
  success: boolean;
  message: string;
  data: {
    data: Array<{
      id: string;
      userId?: string;
      userName?: string | null;
      userEmail?: string | null;
      userRole?: string | null;
      childProfileId?: string | null;
      childName?: string | null;
      overallScore: number | string | null;
      categoryResult: string;
      focusSummary: string | null;
      focusAreas: any;
      skillsData: any;
      createdAt: string;
      user?: {
        id: string;
        name: string;
        email: string;
        role: string;
      };
      childProfile?: {
        id: string;
        name: string;
      } | null;
    }>;
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AdminAssessmentsData {
  assessments: AdminAssessmentsResponse['data']['data'];
  pagination: AdminAssessmentsResponse['data']['pagination'];
}

export async function getAdminOverview(token: string): Promise<AdminOverviewResponse> {
  const response = await fetch(`${API_URL}/admin/overview`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil data overview');
  }
  return data;
}

export async function getAdminUsers(
  params: { role?: string; search?: string; page?: number; limit?: number },
  token: string
): Promise<AdminUsersData> {
  const searchParams = new URLSearchParams();
  if (params.role && params.role !== 'Semua') searchParams.set('role', params.role);
  if (params.search) searchParams.set('search', params.search);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`${API_URL}/admin/users?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data: AdminUsersResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil data users');
  }

  return {
    users: data.data?.data ?? [],
    pagination: data.data?.pagination ?? {
      page: 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

export async function getAdminAssessments(
  params: { role?: string; categoryResult?: string; page?: number; limit?: number },
  token: string
): Promise<AdminAssessmentsData> {
  const searchParams = new URLSearchParams();
  if (params.role && params.role !== 'Semua') searchParams.set('role', params.role);
  if (params.categoryResult && params.categoryResult !== 'Semua') searchParams.set('categoryResult', params.categoryResult);
  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const response = await fetch(`${API_URL}/admin/assessments?${searchParams.toString()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const data: AdminAssessmentsResponse = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Gagal mengambil data assessments');
  }

  return {
    assessments: data.data?.data ?? [],
    pagination: data.data?.pagination ?? {
      page: 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 0,
    },
  };
}

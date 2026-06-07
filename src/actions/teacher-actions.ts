const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TeacherResult {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  childProfileId: string | null;
  childName: string | null;
  overallScore: number | string | null;
  categoryResult: string | null;
  focusSummary: string | null;
  focusAreas: unknown;
  skillsData: unknown;
  createdAt: string;
}

interface TeacherResultsApiResponse {
  success: boolean;
  message: string;
  data?: {
    data?: TeacherResult[];
    pagination?: Partial<Pagination>;
  };
}

export interface TeacherResultsData {
  results: TeacherResult[];
  pagination: Pagination;
}

export interface TeacherResultsResponse {
  success: boolean;
  message: string;
  data: TeacherResultsData;
}

export class TeacherResultsError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'TeacherResultsError';
    this.status = status;
  }
}

const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  total: 0,
  totalPages: 0,
};

function normalizePagination(pagination?: Partial<Pagination>, limit = 20): Pagination {
  return {
    page: Number(pagination?.page ?? 1),
    limit: Number(pagination?.limit ?? limit),
    total: Number(pagination?.total ?? 0),
    totalPages: Number(pagination?.totalPages ?? 0),
  };
}

export async function getTeacherResults(
  params: { page?: number; limit?: number } = {},
  token: string
): Promise<TeacherResultsResponse> {
  if (!token) {
    throw new TeacherResultsError(401, 'Sesi berakhir. Silakan login kembali.');
  }

  const searchParams = new URLSearchParams();
  const limit = params.limit ?? defaultPagination.limit;

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  const response = await fetch(`${API_URL}/teacher/results${query ? `?${query}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const payload: TeacherResultsApiResponse | null = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new TeacherResultsError(
      response.status,
      payload?.message || 'Gagal mengambil data hasil assessment.'
    );
  }

  const responseData = payload?.data;

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? 'Teacher results fetched successfully',
    data: {
      results: Array.isArray(responseData?.data) ? responseData.data : [],
      pagination: normalizePagination(responseData?.pagination, limit),
    },
  };
}

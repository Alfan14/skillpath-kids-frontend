const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ParentResult {
  id: string;
  userId: string;
  userName: string | null;
  userEmail: string | null;
  userRole: string | null;
  childProfileId: string | null;
  childName: string | null;
  overallScore: number | string | null;
  categoryResult: string | null;
  developmentStage: string | null;
  focusSummary: string | null;
  focusAreas: string[] | string | null;
  skillsData: Record<string, unknown> | string | null;
  createdAt: string;
}

interface ParentResultsApiResponse {
  success: boolean;
  message: string;
  data?: {
    data?: ParentResult[];
    pagination?: Partial<Pagination>;
  };
}

export interface ParentResultsData {
  results: ParentResult[];
  pagination: Pagination;
}

export interface ParentResultsResponse {
  success: boolean;
  message: string;
  data: ParentResultsData;
}

export class ParentResultsError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ParentResultsError';
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

export async function getParentResults(
  params: { page?: number; limit?: number } = {},
  token: string
): Promise<ParentResultsResponse> {
  if (!token) {
    throw new ParentResultsError(401, 'Sesi berakhir. Silakan login kembali.');
  }

  const searchParams = new URLSearchParams();
  const limit = params.limit ?? defaultPagination.limit;

  if (params.page) searchParams.set('page', params.page.toString());
  if (params.limit) searchParams.set('limit', params.limit.toString());

  const query = searchParams.toString();
  const response = await fetch(`${API_URL}/parent/results${query ? `?${query}` : ''}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  const payload: ParentResultsApiResponse | null = await response.json().catch(() => null);

  if (!response.ok || payload?.success === false) {
    throw new ParentResultsError(
      response.status,
      payload?.message || 'Gagal mengambil data hasil assessment.'
    );
  }

  const responseData = payload?.data;

  return {
    success: payload?.success ?? true,
    message: payload?.message ?? 'Parent results fetched successfully',
    data: {
      results: Array.isArray(responseData?.data) ? responseData.data : [],
      pagination: normalizePagination(responseData?.pagination, limit),
    },
  };
}

import { apiClient, type ApiResponse } from "@/shared/lib/axios";
import type { Sdg, SdgCreateInput, SdgUpdateInput, SdgListResponse } from "../types/sdg.types";

const SDGS_ENDPOINT = "/sdgs";

export const sdgService = {
  /**
   * GET /api/v1/sdgs
   * Get all SDGs with their images
   */
  getAll: async (): Promise<Sdg[]> => {
    const { data } = await apiClient.get<ApiResponse<SdgListResponse>>(
      SDGS_ENDPOINT
    );
    return data.data.sdgs;
  },

  /**
   * GET /api/v1/sdgs/:id
   * Get SDG by ID
   */
  getById: async (id: number): Promise<Sdg> => {
    const { data } = await apiClient.get<ApiResponse<Sdg>>(
      `${SDGS_ENDPOINT}/${id}`
    );
    return data.data;
  },

  /**
   * GET /api/v1/sdgs/search?filename=...
   * Search SDG by filename
   */
  search: async (filename: string): Promise<Sdg> => {
    const { data } = await apiClient.get<ApiResponse<Sdg>>(
      `${SDGS_ENDPOINT}/search`,
      { params: { filename } }
    );
    return data.data;
  },

  /**
   * POST /api/v1/sdgs
   * Create new SDG with image upload
   */
  create: async (input: SdgCreateInput): Promise<Sdg> => {
    const formData = new FormData();
    formData.append("image", input.image);

    const { data } = await apiClient.post<ApiResponse<Sdg>>(
      SDGS_ENDPOINT,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data;
  },

  /**
   * PUT /api/v1/sdgs/:id
   * Update SDG image (uses POST with _method=PUT for FormData)
   */
  update: async (id: number, input: SdgUpdateInput): Promise<Sdg> => {
    const formData = new FormData();
    formData.append("_method", "PUT"); // Laravel method spoofing
    formData.append("image", input.image);

    const { data } = await apiClient.post<ApiResponse<Sdg>>(
      `${SDGS_ENDPOINT}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data.data;
  },
};

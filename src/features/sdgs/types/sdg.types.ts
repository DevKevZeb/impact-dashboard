/**
 * SDG Entity - Objetivo de Desarrollo Sostenible
 * Matches Laravel SdgResource structure
 */
export interface Sdg {
  id: number;
  image: string; // Path: "sdg_images/1732567890_sdg-01.png"
  filename: string; // Original filename: "sdg-01.png"
  image_url?: string; // Full URL from backend
  created_at?: string;
  updated_at?: string;
}

/**
 * Input for creating a SDG
 */
export interface SdgCreateInput {
  image: File; // Image file (jpg, jpeg, png, gif, webp, svg - max 2MB)
}

/**
 * Input for updating a SDG
 */
export interface SdgUpdateInput {
  image: File;
}

/**
 * API response for SDG list
 */
export interface SdgListResponse {
  sdgs: Sdg[];
  total: number;
}

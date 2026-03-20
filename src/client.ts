/**
 * NameFYI API client — TypeScript wrapper for namefyi.com REST API.
 *
 * Zero dependencies. Uses native `fetch`.
 *
 * @example
 * ```ts
 * import { NameFYI } from "namefyi";
 * const api = new NameFYI();
 * const items = await api.search("query");
 * ```
 */

/** Generic API response type. */
export interface ApiResponse {
  [key: string]: unknown;
}

export class NameFYI {
  private baseUrl: string;

  constructor(baseUrl = "https://namefyi.com") {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  private async get<T = ApiResponse>(
    path: string,
    params?: Record<string, string>,
  ): Promise<T> {
    const url = new URL(path, this.baseUrl);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
    }
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  }

  // -- Endpoints ----------------------------------------------------------

  /** List all characters. */
  async listCharacters(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/characters/", params);
  }

  /** Get character by slug. */
  async getCharacter(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/characters/${slug}/`);
  }

  /** List all cultures. */
  async listCultures(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/cultures/", params);
  }

  /** Get culture by slug. */
  async getCulture(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/cultures/${slug}/`);
  }

  /** List all faqs. */
  async listFaqs(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/faqs/", params);
  }

  /** Get faq by slug. */
  async getFaq(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/faqs/${slug}/`);
  }

  /** List all given names. */
  async listGivenNames(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/given-names/", params);
  }

  /** Get given name by slug. */
  async getGivenName(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/given-names/${slug}/`);
  }

  /** List all glossary. */
  async listGlossary(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/glossary/", params);
  }

  /** Get term by slug. */
  async getTerm(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/glossary/${slug}/`);
  }

  /** List all guides. */
  async listGuides(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/guides/", params);
  }

  /** Get guide by slug. */
  async getGuide(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/guides/${slug}/`);
  }

  /** List all meaning tags. */
  async listMeaningTags(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/meaning-tags/", params);
  }

  /** Get meaning tag by slug. */
  async getMeaningTag(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/meaning-tags/${slug}/`);
  }

  /** List all surnames. */
  async listSurnames(params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/surnames/", params);
  }

  /** Get surname by slug. */
  async getSurname(slug: string): Promise<ApiResponse> {
    return this.get(`/api/v1/surnames/${slug}/`);
  }

  /** Search across all content. */
  async search(query: string, params?: Record<string, string>): Promise<ApiResponse> {
    return this.get("/api/v1/search/", { q: query, ...params });
  }
}

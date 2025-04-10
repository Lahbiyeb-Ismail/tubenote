import type { IPaginatedData, IPaginationMeta } from "@tubenote/types";

import { ResponseFormatter } from "../response-formatter.service";

import type {
  IResponseOptions,
  ISanitizationOptions,
  ISanitizationRule,
} from "../response-formatter.types";

describe("ResponseFormatter", () => {
  let responseFormatter: ResponseFormatter;

  beforeEach(() => {
    // Get a fresh instance for each test
    responseFormatter = ResponseFormatter.getInstance();
  });

  describe("getInstance", () => {
    it("should return a singleton instance", () => {
      const instance1 = ResponseFormatter.getInstance();
      const instance2 = ResponseFormatter.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe("sanitizeData", () => {
    it("should return the same data if data is null or undefined", () => {
      expect(responseFormatter.sanitizeData(null)).toBeNull();
      expect(responseFormatter.sanitizeData(undefined)).toBeUndefined();
    });

    it("should sanitize sensitive fields in an object", () => {
      const data = {
        id: 1,
        name: "John Doe",
        password: "secret123",
        apiKey: "api-key-123",
        creditCard: "1234-5678-9012-3456",
        details: {
          ssn: "123-45-6789",
          authorization: "Bearer token123",
        },
      };

      const sanitized = responseFormatter.sanitizeData(data);

      expect(sanitized).toEqual({
        id: 1,
        name: "John Doe",
        details: {},
      });
      expect(sanitized.password).toBeUndefined();
      expect(sanitized.apiKey).toBeUndefined();
      expect(sanitized.creditCard).toBeUndefined();
      expect(sanitized.details.ssn).toBeUndefined();
      expect(sanitized.details.authorization).toBeUndefined();
    });

    it("should sanitize arrays of objects", () => {
      const data = [
        { id: 1, name: "John", password: "secret1" },
        { id: 2, name: "Jane", password: "secret2" },
      ];

      const sanitized = responseFormatter.sanitizeData(data);

      expect(sanitized).toEqual([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]);
    });

    it("should handle deeply nested objects", () => {
      const data = {
        user: {
          profile: {
            details: {
              privateKey: "very-secret",
              publicInfo: "not-secret",
            },
          },
          settings: {
            accessKey: "access-123",
          },
        },
      };

      const sanitized = responseFormatter.sanitizeData(data);

      expect(sanitized).toEqual({
        user: {
          profile: {
            details: {
              publicInfo: "not-secret",
            },
          },
          settings: {},
        },
      });
    });

    it("should use custom sanitization rules when provided", () => {
      const data = {
        id: 1,
        name: "John",
        customSecret: "should-be-removed",
        password: "should-remain", // Default rule ignored
      };

      const customRules: ISanitizationRule[] = [
        { fieldPattern: /customSecret/ },
      ];

      const sanitized = responseFormatter.sanitizeData(data, customRules);

      expect(sanitized).toEqual({
        id: 1,
        name: "John",
        password: "should-remain",
      });
    });

    it("should handle primitive values correctly", () => {
      expect(responseFormatter.sanitizeData("string")).toBe("string");
      expect(responseFormatter.sanitizeData(123)).toBe(123);
      expect(responseFormatter.sanitizeData(true)).toBe(true);
    });

    it("should handle empty objects and arrays", () => {
      expect(responseFormatter.sanitizeData({})).toEqual({});
      expect(responseFormatter.sanitizeData([])).toEqual([]);
    });
  });

  describe("isFieldSensitive", () => {
    it("should return true for sensitive field names", () => {
      const rules: ISanitizationRule[] = [
        { fieldPattern: /password/i },
        { fieldPattern: "exactMatch" },
      ];

      expect(responseFormatter.isFieldSensitive("password", rules)).toBe(true);
      expect(responseFormatter.isFieldSensitive("userPassword", rules)).toBe(
        true
      );
      expect(responseFormatter.isFieldSensitive("PASSWORD", rules)).toBe(true);
      expect(responseFormatter.isFieldSensitive("exactMatch", rules)).toBe(
        true
      );
    });

    it("should return false for non-sensitive field names", () => {
      const rules: ISanitizationRule[] = [
        { fieldPattern: /password/i },
        { fieldPattern: "exactMatch" },
      ];

      expect(responseFormatter.isFieldSensitive("username", rules)).toBe(false);
      expect(responseFormatter.isFieldSensitive("pass", rules)).toBe(false);
      expect(responseFormatter.isFieldSensitive("notExactMatch", rules)).toBe(
        false
      );
    });

    it("should handle empty rules array", () => {
      expect(responseFormatter.isFieldSensitive("password", [])).toBe(false);
    });
  });

  describe("formatResponse", () => {
    it("should format a basic response correctly", () => {
      const responseOptions: IResponseOptions<{ id: number; name: string }> = {
        success: true,
        data: { id: 1, name: "Test" },
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatResponse({ responseOptions });

      expect(response).toEqual(responseOptions);
    });

    it("should include pagination info when provided", () => {
      const paginationMeta: IPaginationMeta = {
        totalPages: 5,
        totalItems: 50,
        currentPage: 2,
        hasNextPage: true,
        hasPrevPage: true,
      };

      const responseOptions: IResponseOptions<Array<{ id: number }>> = {
        success: true,
        data: [{ id: 1 }, { id: 2 }],
        status: 200,
        message: "Success",
        paginationMeta,
      };

      const response = responseFormatter.formatResponse({ responseOptions });

      expect(response).toEqual(responseOptions);
    });

    it("should handle response without data", () => {
      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 204,
        message: "No Content",
      };

      const response = responseFormatter.formatResponse({ responseOptions });

      expect(response).toEqual(responseOptions);
    });

    it("should sanitize data by default", () => {
      const responseOptions: IResponseOptions<{
        id: number;
        name: string;
        password: string;
      }> = {
        success: true,
        data: { id: 1, name: "Test", password: "secret" },
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatResponse({ responseOptions });

      expect(response.data).toEqual({ id: 1, name: "Test" });
      expect(response.data?.password).toBeUndefined();
    });

    it("should not sanitize data when sanitize option is false", () => {
      const responseOptions: IResponseOptions<{
        id: number;
        name: string;
        password: string;
      }> = {
        success: true,
        data: { id: 1, name: "Test", password: "secret" },
        status: 200,
        message: "Success",
      };

      const sanitizationOptions: ISanitizationOptions = {
        sanitize: false,
      };

      const response = responseFormatter.formatResponse({
        responseOptions,
        sanitizationOptions,
      });

      expect(response.data).toEqual({
        id: 1,
        name: "Test",
        password: "secret",
      });
    });

    it("should use custom sanitization rules when provided", () => {
      const responseOptions: IResponseOptions<{
        id: number;
        name: string;
        password: string;
        customField: string;
      }> = {
        success: true,
        data: {
          id: 1,
          name: "Test",
          password: "secret",
          customField: "sensitive",
        },
        status: 200,
        message: "Success",
      };

      const sanitizationOptions: ISanitizationOptions = {
        sanitize: true,
        sanitizationRules: [{ fieldPattern: /customField/ }],
      };

      const response = responseFormatter.formatResponse({
        responseOptions,
        sanitizationOptions,
      });

      expect(response.data).toEqual({
        id: 1,
        name: "Test",
        password: "secret",
      });
      expect(response.data?.customField).toBeUndefined();
    });
  });

  describe("formatPaginatedResponse", () => {
    it("should format a paginated response correctly", () => {
      const page = 2;
      const paginatedData: IPaginatedData<{ id: number }> = {
        data: [{ id: 1 }, { id: 2 }],
        totalItems: 10,
        totalPages: 5,
      };

      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions,
      });

      expect(response).toEqual({
        success: true,
        message: "Success",
        status: 200,
        data: [{ id: 1 }, { id: 2 }],
        paginationMeta: {
          totalPages: 5,
          totalItems: 10,
          currentPage: 2,
          hasNextPage: true,
          hasPrevPage: true,
        },
      });
    });

    it("should handle first page correctly", () => {
      const page = 1;
      const paginatedData: IPaginatedData<{ id: number }> = {
        data: [{ id: 1 }, { id: 2 }],
        totalItems: 10,
        totalPages: 5,
      };

      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions,
      });

      expect(response.paginationMeta).toEqual({
        totalPages: 5,
        totalItems: 10,
        currentPage: 1,
        hasNextPage: true,
        hasPrevPage: false,
      });
    });

    it("should handle last page correctly", () => {
      const page = 5;
      const paginatedData: IPaginatedData<{ id: number }> = {
        data: [{ id: 9 }, { id: 10 }],
        totalItems: 10,
        totalPages: 5,
      };

      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions,
      });

      expect(response.paginationMeta).toEqual({
        totalPages: 5,
        totalItems: 10,
        currentPage: 5,
        hasNextPage: false,
        hasPrevPage: true,
      });
    });

    it("should use default page 1 when page is not provided", () => {
      const page = null as unknown as number; // Simulate no page provided
      const paginatedData: IPaginatedData<{ id: number }> = {
        data: [{ id: 1 }, { id: 2 }],
        totalItems: 10,
        totalPages: 5,
      };

      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions,
      });

      expect(response.paginationMeta?.currentPage).toBe(1);
    });

    it("should sanitize data in paginated response", () => {
      const page = 1;
      const paginatedData: IPaginatedData<{ id: number; password: string }> = {
        data: [
          { id: 1, password: "secret1" },
          { id: 2, password: "secret2" },
        ],
        totalItems: 2,
        totalPages: 1,
      };

      const responseOptions: IResponseOptions<null> = {
        success: true,
        status: 200,
        message: "Success",
      };

      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions,
      });

      expect(response.data).toEqual([{ id: 1 }, { id: 2 }]);
    });
  });

  describe("getPaginationQueries", () => {
    it("should calculate pagination parameters correctly", () => {
      const reqQuery = {
        page: 2,
        limit: 10,
        sortBy: "name",
        order: "asc",
      };

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 8,
      });

      expect(result).toEqual({
        skip: 10,
        limit: 10,
        sort: {
          by: "name",
          order: "asc",
        },
      });
    });

    it("should use default values when query parameters are not provided", () => {
      const reqQuery = {};

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 8,
      });

      expect(result).toEqual({
        skip: 0,
        limit: 8,
        sort: {
          by: "createdAt",
          order: "desc",
        },
      });
    });

    it("should handle string values for page and limit", () => {
      const reqQuery = {
        page: 3,
        limit: 5,
      };

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 8,
      });

      expect(result).toEqual({
        skip: 10, // (3-1) * 5
        limit: 5,
        sort: {
          by: "createdAt",
          order: "desc",
        },
      });
    });

    it("should enforce minimum values for page and limit", () => {
      const reqQuery = {
        page: -1,
        limit: 0,
      };

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 8,
      });

      expect(result).toEqual({
        skip: 0, // (1-1) * 1
        limit: 8, // Minimum value enforced
        sort: {
          by: "createdAt",
          order: "desc",
        },
      });
    });

    it("should handle non-numeric values for page and limit", () => {
      const reqQuery = {
        page: "abc" as unknown as number,
        limit: "xyz" as unknown as number,
      };

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 8,
      });

      expect(result).toEqual({
        skip: 0, // (1-1) * 8
        limit: 8,
        sort: {
          by: "createdAt",
          order: "desc",
        },
      });
    });

    it("should use provided itemsPerPage when limit is not specified", () => {
      const reqQuery = {
        page: 2,
      };

      const result = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 15,
      });

      expect(result).toEqual({
        skip: 15, // (2-1) * 15
        limit: 15,
        sort: {
          by: "createdAt",
          order: "desc",
        },
      });
    });
  });

  // Integration tests that combine multiple methods
  describe("Integration tests", () => {
    it("should correctly format and sanitize a paginated response", () => {
      // Setup test data
      const page = 2;
      const paginatedData: IPaginatedData<{
        id: number;
        name: string;
        password: string;
      }> = {
        data: [
          { id: 3, name: "User 3", password: "secret3" },
          { id: 4, name: "User 4", password: "secret4" },
        ],
        totalItems: 10,
        totalPages: 5,
      };

      // Format the response
      const response = responseFormatter.formatPaginatedResponse({
        page,
        paginatedData,
        responseOptions: {
          success: true,
          status: 200,
          message: "Success",
        },
      });

      // Verify the response structure and sanitization
      expect(response).toEqual({
        success: true,
        status: 200,
        message: "Success",
        data: [
          { id: 3, name: "User 3" },
          { id: 4, name: "User 4" },
        ],
        paginationMeta: {
          totalPages: 5,
          totalItems: 10,
          currentPage: 2,
          hasNextPage: true,
          hasPrevPage: true,
        },
      });

      // Verify sensitive data was removed
      expect(response.data && response.data[0]?.password).toBeUndefined();
      expect(response.data && response.data[1]?.password).toBeUndefined();
    });

    it("should handle the complete flow from pagination queries to formatted response", () => {
      // Setup request query
      const reqQuery = {
        page: 2,
        limit: 3,
        sortBy: "name",
        order: "asc",
      };

      // Get pagination parameters
      const paginationParams = responseFormatter.getPaginationQueries({
        reqQuery,
        itemsPerPage: 10,
      });

      // Verify pagination parameters
      expect(paginationParams).toEqual({
        skip: 3,
        limit: 3,
        sort: {
          by: "name",
          order: "asc",
        },
      });

      // Mock paginated data that would come from a repository
      const paginatedData: IPaginatedData<{
        id: number;
        name: string;
        apiKey: string;
      }> = {
        data: [
          { id: 4, name: "User 4", apiKey: "key4" },
          { id: 5, name: "User 5", apiKey: "key5" },
          { id: 6, name: "User 6", apiKey: "key6" },
        ],
        totalItems: 10,
        totalPages: 4,
      };

      // Format the response
      const response = responseFormatter.formatPaginatedResponse({
        page: reqQuery.page,
        paginatedData,
        responseOptions: {
          success: true,
          status: 200,
          message: "Success",
        },
      });

      // Verify the complete response
      expect(response).toEqual({
        success: true,
        status: 200,
        message: "Success",
        data: [
          { id: 4, name: "User 4" },
          { id: 5, name: "User 5" },
          { id: 6, name: "User 6" },
        ],
        paginationMeta: {
          totalPages: 4,
          totalItems: 10,
          currentPage: 2,
          hasNextPage: true,
          hasPrevPage: true,
        },
      });
    });
  });
});

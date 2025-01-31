import type { Response } from "express";
import httpStatus from "http-status";

import type { TokenParamDto } from "@/common/dtos/token-param.dto";
import { ERROR_MESSAGES } from "@/constants/error-messages.contants";
import { BadRequestError, NotFoundError } from "@/errors";
import type { EmptyRecord, TypedRequest } from "@/types";
import { VerifyEmailController } from "../verify-email.controller";
import type {
  IVerifyEmailController,
  IVerifyEmailService,
} from "../verify-email.types";

describe("VerifyEmailController", () => {
  let mockResponse: Partial<Response>;

  let verifyEmailController: IVerifyEmailController;
  let mockVerifyEmailService: jest.Mocked<IVerifyEmailService>;

  const mockValidToken = "valid-verification-token";
  const mockInvalidToken = "invalid-verification-token";

  const mockValidRequest = {
    params: {
      token: mockValidToken,
    },
  } as TypedRequest<EmptyRecord, TokenParamDto>;

  const mockInvalidRequest = {
    params: {
      token: mockInvalidToken,
    },
  } as TypedRequest<EmptyRecord, TokenParamDto>;

  beforeEach(() => {
    mockVerifyEmailService = {
      verifyUserEmail: jest.fn(),
      generateToken: jest.fn(),
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    verifyEmailController = new VerifyEmailController(mockVerifyEmailService);
  });

  describe("VerifyEmailController - verifyEmail", () => {
    it("should verify email with a valid token", async () => {
      await verifyEmailController.verifyEmail(
        mockValidRequest,
        mockResponse as Response
      );

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidRequest.params.token
      );
      expect(mockResponse.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Email verified successfully.",
      });
    });

    it("should throw a BadRequestError if email is already verified", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.EMAIL_ALREADY_VERIFIED);
      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockValidRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError for an invalid token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockInvalidRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockInvalidRequest.params.token
      );

      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError for an empty token", async () => {
      const mockEmptyTokenRequest = {
        params: { token: "" },
      } as TypedRequest<EmptyRecord, TokenParamDto>;

      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockEmptyTokenRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith("");
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should throw a NotFoundError if user is not found", async () => {
      const error = new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);

      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockValidRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidRequest.params.token
      );
    });

    it("should throw a BadRequestError if token is not found in the database", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockInvalidRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockInvalidRequest.params.token
      );
    });

    it("should propagate unexpected errors", async () => {
      const error = new Error("Unexpected error");
      mockVerifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(
          mockValidRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(error);

      expect(mockVerifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
});

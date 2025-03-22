import type { Response } from "express";
import httpStatus from "http-status";

import { BadRequestError, NotFoundError } from "@/modules/shared/api-errors";
import { ERROR_MESSAGES } from "@/modules/shared/constants";
import type { IParamTokenDto } from "@/modules/shared/dtos";
import type { EmptyRecord, TypedRequest } from "@/modules/shared/types";

import {
  IVerifyEmailService,
  VerifyEmailController,
} from "@/modules/auth/features";
import { mock, mockReset } from "jest-mock-extended";

describe("VerifyEmailController", () => {
  const verifyEmailService = mock<IVerifyEmailService>();
  const verifyEmailController = VerifyEmailController.getInstance({
    verifyEmailService,
  });

  const res = mock<Response>();

  const mockValidToken = "valid-verification-token";
  const mockInvalidToken = "invalid-verification-token";

  const validReq = mock<TypedRequest<EmptyRecord, IParamTokenDto>>();
  const inValidReq = mock<TypedRequest<EmptyRecord, IParamTokenDto>>();

  beforeEach(() => {
    mockReset(verifyEmailService);

    validReq.params.token = mockValidToken;
    inValidReq.params.token = mockInvalidToken;

    res.status.mockReturnThis();
    res.json.mockReturnThis();
  });

  describe("VerifyEmailController - verifyEmail", () => {
    it("should verify email with a valid token", async () => {
      await verifyEmailController.verifyEmail(validReq, res);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        validReq.params.token
      );
      expect(res.status).toHaveBeenCalledWith(httpStatus.OK);

      expect(res.json).toHaveBeenCalledWith({
        message: "Email verified successfully.",
      });
    });

    it("should throw a BadRequestError if email is already verified", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.ALREADY_VERIFIED);
      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(validReq, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError for an invalid token", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(inValidReq, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        inValidReq.params.token
      );

      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw a BadRequestError for an empty token", async () => {
      const mockEmptyTokenRequest = {
        params: { token: "" },
      } as TypedRequest<EmptyRecord, IParamTokenDto>;

      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(mockEmptyTokenRequest, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith("");
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it("should throw a NotFoundError if user is not found", async () => {
      const error = new NotFoundError(ERROR_MESSAGES.RESOURCE_NOT_FOUND);

      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(validReq, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        validReq.params.token
      );
    });

    it("should throw a BadRequestError if token is not found in the database", async () => {
      const error = new BadRequestError(ERROR_MESSAGES.INVALID_TOKEN);

      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(inValidReq, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        inValidReq.params.token
      );
    });

    it("should propagate unexpected errors", async () => {
      const error = new Error("Unexpected error");
      verifyEmailService.verifyUserEmail.mockRejectedValue(error);

      await expect(
        verifyEmailController.verifyEmail(validReq, res)
      ).rejects.toThrow(error);

      expect(verifyEmailService.verifyUserEmail).toHaveBeenCalledWith(
        mockValidToken
      );
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});

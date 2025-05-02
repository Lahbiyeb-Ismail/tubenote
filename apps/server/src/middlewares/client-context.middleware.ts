import type { NextFunction, Request, Response } from "express";
import { UAParser } from "ua-parser-js";

// Helper to anonymize IP addresses (GDPR compliance)
export const anonymizeIp = (ip?: string) => {
  if (!ip) return null;

  // Handle IPv4
  if (ip.includes(".")) {
    return ip.replace(/\.\d+$/, ".0");
  }

  // Handle IPv6
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.length >= 4 ? `${parts.slice(0, 4).join(":")}::` : ip;
  }

  return ip;
};

export const clientContextMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const userAgent = UAParser(req.headers["user-agent"]);
    const clientType = userAgent.device.type || "web";

    req.clientContext = {
      userAgent: JSON.stringify(userAgent),
      clientType,
    };

    next();
  } catch (error) {
    next(error);
  }
};

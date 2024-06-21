import compression from "compression";
import { Response, type Request } from "express";

function compressFilter(req: Request, res: Response) {
  if (req.headers["x-no-compression"]) {
    // don't compress responses with this request header
    return false;
  }

  // fallback to standard filter function
  return compression.filter(req, res);
}

export default compressFilter;

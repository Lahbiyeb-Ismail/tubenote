import nodemailer, { type Transporter } from "nodemailer";
import envConfig from "./env.config";

const transporter: Transporter = nodemailer.createTransport({
  host: envConfig.email.smtp.host,
  port: +envConfig.email.smtp.port,
  secure: true, // use TLS
  auth: {
    user: envConfig.email.smtp.auth.user,
    pass: envConfig.email.smtp.auth.password,
  },
});

export default transporter;

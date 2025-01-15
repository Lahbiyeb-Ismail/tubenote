export interface SendMailDto {
  emailRecipient: string;
  emailSubject: string;
  htmlContent: string;
  textContent: string;
  logoPath: string;
}

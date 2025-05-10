export interface ILogoutDto {
  userId: string;
  refreshToken: string;
}
export interface IAuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

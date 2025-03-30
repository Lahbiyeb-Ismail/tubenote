export interface ILoginDto {
  email: string;
  password: string;
}

export interface ILogoutDto {
  userId: string;
  refreshToken: string;
}

export interface IRefreshDto {
  userId: string;
  token: string;
}

export interface IAuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

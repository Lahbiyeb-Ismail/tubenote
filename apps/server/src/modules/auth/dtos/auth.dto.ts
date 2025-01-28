export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LogoutDto {
  userId: string;
  refreshToken: string;
}

export interface RefreshDto {
  userId: string;
  token: string;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
}

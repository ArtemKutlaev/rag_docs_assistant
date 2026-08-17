export type LoginResponse = {
  message: string;
  username: string;
  access_token: string;
};

export type RegisterResponse = {
  message: string;
  username: string;
};

export type AuthCredentials = {
  username: string;
  password: string;
};
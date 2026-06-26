export interface TokenPayload {
  userId: string;
  email: string;
}

export interface ITokenService {
  sign(payload: TokenPayload): Promise<string>;
  verify(token: string): Promise<TokenPayload | null>;
}

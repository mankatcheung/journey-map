import { SignJWT, jwtVerify } from 'jose';
import type { ITokenService, TokenPayload } from '../../domain/services/token.service.interface.ts';

export class JwtTokenService implements ITokenService {
  private readonly secretKey: Uint8Array;

  constructor(
    secret: string,
    private readonly expiresIn: string = '7d',
  ) {
    this.secretKey = new TextEncoder().encode(secret);
  }

  async sign(payload: TokenPayload): Promise<string> {
    return new SignJWT({ userId: payload.userId, email: payload.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.expiresIn)
      .sign(this.secretKey);
  }

  async verify(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, this.secretKey);
      if (typeof payload.userId !== 'string' || typeof payload.email !== 'string') return null;
      return { userId: payload.userId, email: payload.email };
    } catch {
      return null;
    }
  }
}

import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { systemLogger } from '../utils/logger';
import { UserType } from 'src/types/user.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async generateJwtToken(user: any) {
    const payload = { sub: user.auth0Id, email: user.email, role: user.role || 'user' };
    systemLogger.log(`Generating JWT with payload: ${JSON.stringify(payload)}`);
    const token = this.jwtService.sign(payload);
    systemLogger.log(`Generated JWT: ${token}`);
    return token;
  }

  async validateUser(profile: any): Promise<any> {
    const { sub: auth0Id, email, given_name, family_name, picture } = profile;
    let user: Partial<UserType> = await this.userService.findByAuth0Id(auth0Id);
    if (!user) {
      systemLogger.log(`Creating new user for Auth0 ID ${auth0Id}`);
      user = await this.userService.create({
        auth0Id,
        email,
        firstName: given_name,
        lastName: family_name,
        avatar: picture,
      });
      systemLogger.log(`Created new user with email ${email}`);
    }
    return user;
  }
}

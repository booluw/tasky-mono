import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

import { AuthLoginDto } from './dto/create-auth.dto';
import {
  bcryptSalt,
  findUserByEmail,
  isEmailTaken,
  sendEmail,
} from 'utils/helpers';
import { Projects, Tasks, Users } from '@prisma/client';

import { prisma } from 'config/prisma';

type AuthResponse<TUser extends Users = Users> = Promise<{
  user: TUser & {
    tasks: Tasks[];
    watching: Tasks[];
    projects: Projects[];
    createdProjects: Projects[];
  };
  auth: {
    token: string;
    refresh: string;
  };
  setPassword: boolean;
}>;

@Injectable()
export class AuthService {
  constructor(private jwtServce: JwtService) {}

  async logUserIn(data: AuthLoginDto): AuthResponse {
    try {
      const _user = await findUserByEmail(data.email);

      const compareHash = bcrypt.compareSync(data.password, _user.passwordHash);
      const setPassword = bcrypt.compareSync(data.email, _user.passwordHash);

      if (!compareHash) throw new NotFoundException('wrong email/password');

      const auth = {
        token: this.jwtServce.sign({ userId: _user.id }),
        refresh: this.jwtServce.sign({ userId: _user.id }, { expiresIn: '7d' }),
      };

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { passwordHash: password, ...user } = _user;

      return { user, auth, setPassword } as unknown as AuthResponse;
    } catch (error: any) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async checkEmail(email: string): Promise<boolean> {
    try {
      const user = await findUserByEmail(email);

      if (user) throw new NotFoundException(false);
      return true;
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  async setPassword(data: AuthLoginDto) {
    try {
      if (!(await isEmailTaken(data.email)))
        throw new NotFoundException('user not found');

      await prisma.users.update({
        where: {
          email: data.email,
        },
        data: {
          passwordHash: bcrypt.hashSync(data.password, bcryptSalt()),
        },
      });

      return { message: 'password updated, please login' };
    } catch (error) {
      console.error(error);

      throw new InternalServerErrorException(error);
    }
  }

  async resetPassword(email: string) {
    try {
      const user = await prisma.users.findUniqueOrThrow({
        where: { email },
      });

      if (user) {
        await prisma.users.update({
          data: {
            passwordHash: bcrypt.hashSync(email, bcryptSalt()),
          },
          where: {
            email,
          },
        });

        await sendEmail({
          subject: 'Account Password Request',
          to: [{ name: `${user.firstName} ${user.lastName}`, email }],
          html: `
            <h1>Hello there.</h1>
            <p>Your asked for a password reset. Please log in with your email address as the password</p>
            <p>Thank you.</p>
          `,
        });
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}

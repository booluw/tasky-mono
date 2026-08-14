/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { prisma } from 'config/prisma';
import { isEmpty } from 'lodash';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { SendSmtpEmail, TransactionalEmailsApi } from '@getbrevo/brevo';

export function validateEmail(email: string) {
  try {
    if (isEmpty(email)) {
      throw new Error('Please provide an email');
    }

    if (
      !/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g.test(
        email,
      )
    ) {
      throw new Error('Please provide a valid Email');
    }
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function findUserByEmail(email: string) {
  validateEmail(email);

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
      watching: true,
      projects: true,
      createdProjects: true,
    },
  });

  if (!user) throw { message: 'user not found' } as any;
  return user;
}

export async function findUserById(id: string) {
  try {
    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      include: {
        tasks: true,
        watching: true,
        projects: true,
        createdProjects: true,
      },
    });

    if (!user) throw Error('user not found');
    return user;
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function isEmailTaken(email: string): Promise<boolean> {
  validateEmail(email);

  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      tasks: true,
      watching: true,
      projects: true,
      createdProjects: true,
    },
  });

  console.log(user)
  
  return Boolean(user);
}

export function bcryptSalt() {
  return bcrypt.genSaltSync(10);
}

export async function getUserFromRequest(req: any) {
  if (isEmpty(req.headers.authorization)) {
    throw Error('You must be logged in');
  }
  const userId = jwt.decode(req.headers!.authorization.split(' ')[1]) as any;
  try {
    const user = await findUserById(userId.userId);
    if (isEmpty(user)) throw Error('User does not exist');
    else return user;
  } catch (error: any) {
    throw Error(error);
  }
}

export async function sendEmail({
  subject,
  html,
  to,
}: {
  subject: string;
  html: string;
  to: { email: string; name: string }[];
}) {
  const emailApi = new TransactionalEmailsApi();
  (emailApi as any).authentications.apiKey.apiKey = process.env.BREVO_KEY;

  try {
    const message = new SendSmtpEmail();
    message.subject = subject;
    message.to = to;
    message.htmlContent = html;
    message.sender = {
      name: 'Miss Feyi from BecomingDASH',
      email: 'dashprojectsmanagement@gmail.com',
    };

    const resp = await emailApi.sendTransacEmail(message);

    const res = JSON.stringify(resp.body);
    console.log(res);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function dateDiff({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): number {
  const diffMs = new Date(endDate).getTime() - new Date(startDate).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return diffDays;
}

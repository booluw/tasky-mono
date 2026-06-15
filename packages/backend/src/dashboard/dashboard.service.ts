import { DashboardProject } from '@dash/shared';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';

@Injectable()
export class DashboardService {
  async findAll(req: any): Promise<{ data: DashboardProject[] }> {
    try {
      const user = await getUserFromRequest(req);
      let tasks: unknown[] = [];

      switch (user.role) {
        case 'SUPER_ADMIN':
          tasks = await prisma.tasks.findMany({
            include: {
              sprint: {
                include: {
                  project: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          });
          break;

        default:
          tasks = await prisma.tasks.findMany({
            where: {
              uid: user.id,
              // NOT: {
              //   sprint: {
              //     started: false,
              //   },
              // },
            },
            include: {
              sprint: {
                include: {
                  project: {
                    select: {
                      title: true,
                    },
                  },
                },
              },
            },
          });
          break;
      }

      const dashboard: Record<string, DashboardProject> = {};

      tasks.forEach((task: any) => {
        dashboard[task.sprint.pid] = {
          id: task.sprint.pid,
          title: task.sprint.project.title,
          tasks: [...(dashboard[task.sprint.pid]?.tasks || []), task.status === 'DONE' ? null : task].filter((item) => item !== null),
        };
      });

      return {
        data: Object.values(dashboard) as unknown as DashboardProject[],
      };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({ error });
    }
  }
}

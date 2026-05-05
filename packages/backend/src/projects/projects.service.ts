import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import {
  AddProjectDocumentDto,
  AddStaffToProjectDto,
} from './dto/update-project.dto';

import { UpdateProject } from '@dash/shared';

import { prisma } from 'config/prisma';
import { getUserFromRequest } from 'utils/helpers';
import { PaginationDto } from 'utils/pagination.dto';

@Injectable()
export class ProjectsService {
  async create(createProjectDto: CreateProjectDto, req: any) {
    try {
      const user = await getUserFromRequest(req);

      const { id } = await prisma.projects.create({
        data: {
          uid: user.id,
          status: 'TO_DO',
          ...createProjectDto,
        },
        select: {
          id: true,
        },
      });

      await Promise.all([
        prisma.sprints.create({
          data: {
            title: 'BACKLOG',
            isBacklog: true,
            startDate: new Date(),
            endDate: new Date(),
            goals: 'Project backlog',
            uid: user.id,
            pid: id,
          },
        }),
      ]);

      return { message: 'project created', pid: id };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async fetchAllProjects(pagination: PaginationDto, req: any) {
    try {
      const user = await getUserFromRequest(req);
      let projects: unknown[] = [];
      let count = 0;
      if (user.role === 'SUPER_ADMIN') {
        const [allProjects, allCount] = await prisma.$transaction([
          prisma.projects.findMany({
            include: {
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              users: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      img: true,
                    },
                  },
                },
              },
              createdBy: {
                select: {
                  firstName: true,
                  lastName: true,
                  img: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: Number(pagination.page * pagination.size),
            take: Number(pagination.size),
          }),
          prisma.projects.count(),
        ]);

        projects = allProjects;
        count = allCount;
      } else {
        const [allProjects, allCount] = await prisma.$transaction([
          prisma.projects.findMany({
            where: {
              OR: [
                {
                  sprints: {
                    some: {
                      tasks: {
                        some: {
                          uid: user.id,
                        },
                      },
                    },
                  },
                },
                {
                  uid: user.id,
                },
              ],
            },
            include: {
              client: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              users: {
                include: {
                  user: {
                    select: {
                      firstName: true,
                      lastName: true,
                      img: true,
                    },
                  },
                },
              },
              createdBy: {
                select: {
                  firstName: true,
                  lastName: true,
                  img: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
            skip: Number(pagination.page * pagination.size),
            take: Number(pagination.size),
          }),
          prisma.projects.count({
            where: {
              OR: [
                {
                  sprints: {
                    some: {
                      tasks: {
                        some: {
                          uid: user.id,
                        },
                      },
                    },
                  },
                },
                {
                  uid: user.id,
                },
              ],
            },
          }),
        ]);

        projects = allProjects;
        count = allCount;
      }

      return { count, projects };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string) {
    try {
      const [project, members] = await Promise.all([
        prisma.projects.findUnique({
          where: {
            id,
          },
          include: {
            client: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
            users: {
              include: {
                user: {
                  select: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
        }),
        prisma.tasks.findMany({
          where: {
            sprint: {
              pid: id,
            },
          },
          select: {
            assignedTo: {
              select: {
                firstName: true,
                lastName: true,
                id: true,
              },
            },
          },
        }),
      ]);

      return {
        project,
        members: [
          ...new Map(
            members
              .map(({ assignedTo }) => ({ ...assignedTo }))
              .map((item) => [item.id, item]),
          ).values(),
        ],
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteProject(req: any, id: string): Promise<{ message: string }> {
    try {
      const user = await getUserFromRequest(req);

      if (['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
        await prisma.projects.delete({
          where: {
            id,
          },
        });

        return { message: 'Project deleted' };
      }

      throw new Error('Unauthorized to delete project');
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({ error });
    }
  }

  async findProjectDocuments(id: string) {
    try {
      return await prisma.projects.findUnique({
        where: { id },
        select: {
          documents: true,
        },
      });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addProjectDocuments(id: string, doc: AddProjectDocumentDto) {
    try {
      const docs = await prisma.projects.findUnique({
        where: { id },
        select: { documents: true },
      });

      const documents = (docs?.documents as any[] | null) ?? [];

      await prisma.projects.update({
        where: { id },
        data: {
          documents: [...documents, { ...doc, uploaded: new Date() }],
        },
      });

      return { message: 'Document added to project' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async addStaffToProject(
    id: string,
    updateProjectDto: AddStaffToProjectDto[],
  ) {
    try {
      await prisma.projects_Users.createMany({
        data: updateProjectDto.map((item) => ({
          ...item,
          pid: id,
        })),
      });

      return { message: 'users added to project' };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async projectAnalytics(req: any) {
    try {
      const user = await getUserFromRequest(req);

      let total = 0;
      let active = 0;
      let completed = 0;

      if (user.role === 'ADMIN') {
        const [allTotal, allActive, allCompleted] = await Promise.all([
          prisma.tasks.count(),
          prisma.tasks.count({
            where: {
              status: 'IN_PROGRESS',
            },
          }),
          prisma.tasks.count({
            where: {
              status: 'DONE',
            },
          }),
        ]);

        total = allTotal;
        active = allActive;
        completed = allCompleted;
      } else {
        const [allTotal, allActive, allCompleted] = await Promise.all([
          prisma.tasks.count({
            where: {
              uid: user.id,
            },
          }),
          prisma.tasks.count({
            where: {
              uid: user.id,
              status: 'IN_PROGRESS',
            },
          }),
          prisma.tasks.count({
            where: {
              uid: user.id,
              status: 'DONE',
            },
          }),
        ]);

        total = allTotal;
        active = allActive;
        completed = allCompleted;
      }

      return {
        total,
        completed,
        active,
        productivity: Math.ceil((completed / total) * 100),
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async upcomingTasks(req: any) {
    try {
      const user = await getUserFromRequest(req);
      let deadlines: unknown[] = [];

      if (user.role === 'ADMIN') {
        deadlines = await prisma.tasks.findMany({
          where: {
            dueDate: {
              gte: new Date(),
            },
            NOT: {
              status: 'DONE',
            },
          },
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
        });
      } else {
        deadlines = await prisma.tasks.findMany({
          where: {
            uid: user.id,
            dueDate: {
              gte: new Date(),
            },
            NOT: {
              status: 'DONE',
            },
          },
          include: {
            sprint: {
              include: {
                project: {
                  select: {
                    title: true,
                    id: true,
                  },
                },
              },
            },
          },
          orderBy: {
            dueDate: 'asc',
          },
        });
      }

      return { deadlines };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getUserTasks(req: any) {
    try {
      const user = await getUserFromRequest(req);
      let tasks: unknown[] = [];

      if (user.role === 'ADMIN') {
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
          where: {
            NOT: {
              status: {
                in: ['DONE', 'READY_TO_TEST', 'TESTING'],
              },
            },
          },
        });
      } else {
        tasks = await prisma.tasks.findMany({
          where: {
            uid: user.id,
            NOT: {
              status: {
                in: ['DONE', 'READY_TO_TEST', 'TESTING'],
              },
            },
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
      }

      return { tasks };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProject(
    req: any,
    id: string,
    project: UpdateProject,
  ): Promise<{ message: string }> {
    try {
      const user = await getUserFromRequest(req);

      if (!['USER', 'CLIENT'].includes(user.role)) {
        await prisma.projects.update({
          data: project,
          where: {
            id,
          },
        });
      } else {
        throw new Error('You do not have permission to do this');
      }

      return { message: 'project updated' };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException({ error });
    }
  }
}

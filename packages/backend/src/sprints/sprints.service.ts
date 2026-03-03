import { Injectable, InternalServerErrorException } from '@nestjs/common';
import {
  CreateSprintDto,
  CreateSprintTaskDto,
  EndSprintDto,
} from './dto/create-sprint.dto';
import { UpdateSprintDto } from './dto/update-sprint.dto';
import { prisma } from 'config/prisma';
import { dateDiff, getUserFromRequest, sendEmail } from 'utils/helpers';
import {
  sprintEndedEmailBuilder,
  sprintStartedEmailBuilder,
  taskTableBuilderForEmail,
} from 'utils/email';
import { groupBy } from 'lodash';

@Injectable()
export class SprintsService {
  async create(createSprintDto: CreateSprintDto, req: any) {
    const user = await getUserFromRequest(req);

    try {
      await prisma.sprints.create({
        data: {
          ...createSprintDto,
          uid: user.id,
        },
      });

      return { message: 'sprint added' };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  findAll() {
    return `This action returns all sprints`;
  }

  async findSprintsByProjectId(pid: string) {
    try {
      const sprints = await prisma.sprints.findMany({
        where: {
          pid,
          isEnded: false,
        },
        include: {
          tasks: {
            include: {
              assignedTo: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                  username: true,
                  img: true,
                  role: true,
                },
              },
            },
            orderBy: {
              startDate: 'asc',
            },
          },
        },
        orderBy: {
          started: 'desc',
        },
      });

      return { sprints };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findSprintById(id: string) {
    try {
      const sprint = await prisma.sprints.findUnique({
        where: {
          id,
        },
        include: {
          tasks: {
            where: {
              status: {
                in: ['IN_PROGRESS', 'TO_DO', 'AWAITING_FEEDBACK'],
              },
            },
            include: {
              assignedTo: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      return { sprint };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findTask(id: string) {
    try {
      const task = await prisma.tasks.findUnique({
        where: { id },
        include: {
          sprint: {
            include: {
              project: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          watcher: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  img: true,
                },
              },
            },
          },
        },
      });

      return { task };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateTask(id: string, data: { status: string }) {
    try {
      const task = await prisma.tasks.update({
        where: { id },
        data: {
          ...data,
        },
        include: {
          sprint: {
            include: {
              project: true,
            },
          },
          assignedTo: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          watcher: {
            select: {
              firstName: true,
              lastName: true,
              id: true,
            },
          },
          comments: {
            include: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                  id: true,
                  img: true,
                },
              },
            },
          },
        },
      });

      if (task.status !== 'TODO') {
        await prisma.projects.update({
          where: {
            id: task.sprint.pid,
          },
          data: {
            status: 'IN_PROGRESS',
          },
        });

        await prisma.sprints.update({
          where: {
            id: task.sprint.id,
          },
          data: {
            started: true,
          },
        });
      }

      return { task };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  update(id: number, updateSprintDto: UpdateSprintDto) {
    return `This action updates a #${id} sprint`;
  }

  remove(id: number) {
    return `This action removes a #${id} sprint`;
  }

  async createSprintTask(sid: string, payload: CreateSprintTaskDto, req: any) {
    const user = await getUserFromRequest(req);

    try {
      const { id, sprint } = await prisma.tasks.create({
        data: {
          ...payload,
          createdBy: user.id,
          sid,
        },
        include: {
          sprint: {
            select: {
              pid: true,
            },
          },
        },
      });

      return {
        message: 'Task added to sprint',
        task: { id, sid, pid: sprint.pid },
      };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async startSprint(sid: string) {
    try {
      const [pid] = await Promise.all([
        prisma.sprints.findUnique({
          where: { id: sid },
          select: { pid: true },
        }),
      ]);

      // if (pid && pid.pid) {
      //   await prisma.sprints.updateMany({
      //     where: {
      //       AND: [
      //         {
      //           pid: pid?.pid,
      //         },
      //         {
      //           started: false,
      //         },
      //       ],
      //     },
      //     data: {
      //       started: false,
      //       isEnded: true,
      //     },
      //   });
      // }

      const tasks = await prisma.sprints.update({
        where: {
          id: sid,
        },
        data: { started: true },
        include: {
          tasks: {
            include: {
              assignedTo: {
                select: {
                  email: true,
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      });

      await Promise.all(
        tasks.tasks.map((task) => {
          return sendEmail({
            subject: 'New Sprint started',
            html: sprintStartedEmailBuilder({
              email: task.assignedTo.email,
              name: `${task.assignedTo.firstName} ${task.assignedTo.lastName}`,
              sprint: {
                title: tasks.title,
                goals: tasks.goals,
                duration: `${dateDiff({
                  startDate: tasks.startDate.toDateString(),
                  endDate: tasks.endDate.toDateString(),
                })} Days`,
                tasks: tasks.tasks.length,
                due: tasks.endDate.toDateString(),
              },
              tasks: tasks.tasks
                .filter((_task) => _task.assignedTo === task.assignedTo)
                .map((_task) =>
                  taskTableBuilderForEmail({
                    title: _task.title,
                    due: _task.dueDate.toDateString(),
                  }),
                )
                .join(''),
            }),
            to: [
              {
                email: task.assignedTo.email,
                name: `${task.assignedTo.firstName} ${task.assignedTo.lastName}`,
              },
            ],
          });
        }),
      );

      return { message: 'sprint started', pid: pid?.pid };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  async endSprint(sid: string, payload: EndSprintDto) {
    try {
      const [pid, tasks] = await Promise.all([
        prisma.sprints.update({
          where: { id: sid },
          data: {
            started: false,
            isEnded: true,
            note: payload.note,
          },
          select: {
            pid: true,
            title: true,
            goals: true,
            endDate: true,
            startDate: true,
          },
        }),
        prisma.tasks.findMany({
          where: {
            sid,
          },
          include: {
            assignedTo: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        }),
      ]);

      // Filter based on assignedTo
      const userTasks = groupBy(tasks, 'uid');

      await Promise.all(
        Object.keys(userTasks).map((userId) => {
          const user = userTasks[userId][0].assignedTo;
          return sendEmail({
            subject: 'Sprint Ended',
            to: [
              {
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
              },
            ],
            html: sprintEndedEmailBuilder({
              name: `${user.firstName} ${user.lastName}`,
              email: user.email,
              sprint: {
                title: pid.title,
                goals: pid.goals,
                duration: `${dateDiff({
                  startDate: pid.startDate.toDateString(),
                  endDate: pid.endDate.toDateString(),
                })} Days`,
                dueDate: pid.endDate.toDateString(),
              },
              task: {
                total: userTasks[userId].length,
                completed: userTasks[userId].filter(
                  (task) => task.status === 'DONE',
                ).length,
                complete_rate:
                  (userTasks[userId].filter((task) => task.status === 'DONE')
                    .length /
                    userTasks[userId].length) *
                  100,
              },
            }),
          });
        }),
      );

      if (payload.tasks.length !== 0) {
        await prisma.tasks.updateMany({
          where: {
            id: {
              in: payload.tasks,
            },
          },
          data: {
            sid: payload.sid,
          },
        });
      }

      return { message: 'Sprint ended', pid: pid.pid };
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}

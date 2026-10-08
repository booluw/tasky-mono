import { Injectable } from '@nestjs/common';
import { prisma } from 'config/prisma';
import { clientReportEmailBuilder } from 'utils/email';
import { sendEmail } from 'utils/helpers';

@Injectable()
export class CronService {
  async sendAllReportToClient() {
    const clientsAndProject = await prisma.clients.findMany({
      include: {
        projects: { where: { status: { not: 'COMPLETED' } } },
      },
    });

    const clientsAndCurrentSprint = await Promise.all(
      clientsAndProject.map(async (item) => {
        const sprint = await Promise.all(
          item.projects.map(async (project) => {
            const sprint = await prisma.sprints.findFirst({
              where: {
                AND: [
                  {
                    pid: project.id,
                  },
                  {
                    started: true,
                  },
                  {
                    isEnded: false,
                  },
                ],
              },
            });

            return {
              sprint,
              projectName: project.title,
            };
          }),
        );

        const client = {
          name: `${item.firstName} ${item.lastName}`,
          email: item.email,
        };

        return sprint
          .filter((sprint) => sprint.sprint !== null)
          .map((sprint) => ({ client, sprint }));
      }),
    ).then((perClient) => perClient.flat());

    const sprintAndTasks = await Promise.all(
      clientsAndCurrentSprint.map(async (item) => {
        const { sprint } = item;

        if (sprint && sprint.sprint) {
          const tasks = await prisma.tasks.findMany({
            where: {
              sid: sprint.sprint.id,
            },
          });

          return {
            tasks,
            sprint: {
              ...item.sprint.sprint,
              projectName: item.sprint.projectName,
            },
            client: item.client,
          };
        }
        return null;
      }),
    );

    const validItems = sprintAndTasks.filter((item) => item !== null);

    await Promise.all(
      validItems.map((item) => {
        return sendEmail({
          subject: 'Weekly project report',
          to: [
            { name: item.client.name, email: item.client.email },
            {
              name: 'Damilola Shopade',
              email: 'dashprojectsmanagement@gmail.com',
            },
          ],
          html: clientReportEmailBuilder({
            client: item.client,
            sprint: {
              progress: item.tasks.length
                ? Math.ceil(
                    (item.tasks.filter((task) => task.status === 'DONE')
                      .length /
                      item.tasks.length) *
                      100,
                  )
                : 0,
              goal: item.sprint.goals ?? '',
              projectName: item.sprint.projectName,
            },
          }),
        });
      }),
    );

    return { message: `Sent out ${validItems.length} reports.` };
  }
}

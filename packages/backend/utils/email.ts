export function welcomeEmailBuilder({
  name,
  email,
  projectName,
}: {
  name: string;
  email: string;
  projectName?: string;
}) {
  return `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>You've Been Added to ${projectName ?? 'Monitora'}</title>
</head>
<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f6f8; padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; padding:40px; border-radius:8px;">

          <!-- Header -->
          <tr>
            <td style="font-size:20px; font-weight:bold; color:#111111; padding-bottom:20px;">
              Hi ${name},
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="font-size:15px; color:#333333; line-height:1.6; padding-bottom:20px;">
              You’ve been added to <strong>${projectName ?? 'Monitora'}</strong> on <strong>Monitora</strong>.
              <br><br>
              This means you are now part of the project workspace where tasks, deadlines, and progress will be tracked. Everything related to your work on this project will live inside the platform.
            </td>
          </tr>

          <!-- Action Section -->
          <tr>
            <td style="font-size:16px; font-weight:bold; color:#111111; padding-bottom:10px;">
              What You Need To Do Now
            </td>
          </tr>

          <tr>
            <td style="font-size:15px; color:#333333; line-height:1.8; padding-bottom:20px;">
              1. Click this link to access the platform:<br>
              <a href="https://monitora.dashtechmanagement.com/" style="color:#1a73e8; text-decoration:none;">
                https://monitora.dashtechmanagement.com/
              </a><br><br>
              2. Log in and complete your profile<br>
              3. Open <strong>${projectName ?? 'Monitora'}</strong><br>
              4. Review your assigned tasks and deadlines
              <br><br>
              If anything is unclear, ask directly within the project comments so everyone stays aligned.
            </td>
          </tr>

          <!-- Usage Section -->
          <tr>
            <td style="font-size:16px; font-weight:bold; color:#111111; padding-bottom:10px;">
              How We Use Monitora
            </td>
          </tr>

          <tr>
            <td style="font-size:15px; color:#333333; line-height:1.8; padding-bottom:25px;">
              • Tasks are updated before deadlines<br>
              • Blockers are flagged early<br>
              • Delays are communicated immediately<br>
              • Comments are clear and action-focused
              <br><br>
              The goal is simple: <strong>clarity, visibility, and consistent execution.</strong>
            </td>
          </tr>

          <!-- Closing -->
          <tr>
            <td style="font-size:15px; color:#333333; line-height:1.6; padding-bottom:30px;">
              We’re glad to have you on <strong>${projectName ?? 'Monitora'}</strong>.
              <br><br>
              Let’s get to work.
            </td>
          </tr>

          <tr>
            <td style="font-size:14px; color:#555555;">
              –<br>
              <strong>Damilola</strong><br>
              Monitora Team
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function sprintStartedEmailBuilder({
  name,
  sprint,
  email,
  tasks,
}: {
  name: string;
  email: string;
  sprint: {
    title: string;
    goals: string;
    duration: string;
    tasks: number;
    due: string;
  };
  tasks: string;
}) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>New Sprint Started - Monitora</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #e8d4d4; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                                            <rect width="32" height="32" rx="4" fill="#5A2C2C"/>
                                            <path d="M9 8h14v2H9V8zm0 4h14v2H9v-2zm0 4h14v2H9v-2zm0 4h10v2H9v-2z" fill="#ffffff"/>
                                            <circle cx="22" cy="22" r="3" fill="#D4A574"/>
                                        </svg>
                                        <span style="font-size: 24px; font-weight: 700; color: #5A2C2C; vertical-align: middle;">Monitora</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Hero Illustration Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #5A2C2C 0%, #7D3C3C 100%); padding: 40px; text-align: center;">
                                        <!-- Illustration placeholder - replace with your illustration -->
                                        <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 60px 20px; min-height: 140px;">
                                            <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.8;">
                                              <img src="https://res.cloudinary.com/domingo-bucket/image/upload/v1761170523/monitora/9006f48f-7795-49d2-abc0-c49b248d227f.png" style="width: 100%; height: auto;" />
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Heading -->
                    <tr>
                        <td style="padding: 32px 40px 16px 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #5A2C2C; line-height: 1.3;">New Sprint Started!</h1>
                        </td>
                    </tr>

                    <!-- Subheading -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px; text-align: center;">
                            <p style="margin: 0; font-size: 16px; color: #666666; line-height: 1.5;">You have been assigned a new task in your sprint</p>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 0 40px 16px 40px;">
                            <p style="margin: 0; font-size: 16px; color: #5A2C2C; font-weight: 600; line-height: 1.5;">Hi ${name},</p>
                        </td>
                    </tr>

                    <!-- Intro Text -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">A new sprint has started! Check your dashboard to view all the details and get started on your assigned tasks.</p>
                        </td>
                    </tr>

                    <!-- Sprint Details Card -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f3f3; border-radius: 8px; border: 1px solid #e8d4d4;">
                                <!-- Sprint Details Header -->
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="text-align: left;">
                                                    <span style="font-size: 16px; font-weight: 600; color: #5A2C2C;">Sprint Details</span>
                                                </td>
                                                <td style="text-align: right;">
                                                    <span style="display: inline-block; background-color: #d4f4dd; color: #2d7a4d; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 500;">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 4px;">
                                                            <path d="M7 0L8.09 4.26L12 5L8.09 5.74L7 10L5.91 5.74L2 5L5.91 4.26L7 0Z" fill="#2d7a4d"/>
                                                        </svg>
                                                        Active
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Sprint Title -->
                                <tr>
                                    <td style="padding: 0 24px 12px 24px;">
                                        <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">
                                          ${sprint.title}
                                        </h2>
                                    </td>
                                </tr>

                                <!-- Goal Section -->
                                <tr>
                                    <td style="padding: 0 24px 20px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="vertical-align: top; padding-right: 8px;">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-top: 2px;">
                                                        <circle cx="8" cy="8" r="6" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                        <path d="M8 4v4l3 3" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                    </svg>
                                                </td>
                                                <td>
                                                    <p style="margin: 0; font-size: 14px; color: #666666; font-weight: 600; margin-bottom: 4px;">Goal</p>
                                                    <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.5;">
                                                      ${sprint.goals}
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Sprint Stats Cards -->
                                <tr>
                                    <td style="padding: 0 24px 24px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <!-- Duration Card -->
                                                <td style="width: 33%; padding-right: 8px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M4 9h16M9 4v2M15 4v2" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Duration</p>
                                                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #333333;">
                                                                  ${sprint.duration}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Tasks Card -->
                                                <td style="width: 33%; padding-right: 8px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M8 8h8M8 12h8M8 16h5" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Tasks</p>
                                                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #333333;">
                                                                  ${sprint.tasks}
                                                                </p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Due Date Card -->
                                                <td style="width: 34%;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <circle cx="12" cy="12" r="8" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M12 7v5l3 3" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Due Date</p>
                                                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${sprint.due}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Top Priority Tasks Section -->
                    <tr>
                        <td style="padding: 0 40px 24px 40px;">
                            <h3 style="margin: 0 0 16px 0; font-size: 18px; font-weight: 600; color: #5A2C2C;">Top Priority Tasks</h3>
                        </td>
                    </tr>

                    ${tasks}

                    <!-- Instructions Text -->
                    <tr>
                        <td style="padding: 0 40px 24px 40px;">
                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6; text-align: center;">Click the link below to view the full task details and start working.</p>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #5A2C2C;">
                                        <a href="${process.env.APP_URL}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                                            View Task Details →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Separator -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="border-top: 1px solid #e8d4d4;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contact Text -->
                    <tr>
                        <td style="padding: 0 40px 16px 40px;">
                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">Have any questions about this task? Reach out to Bamidele or your project manager for clarification.</p>
                        </td>
                    </tr>

                    <!-- Sign Off -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666666;">Best regards,</p>
                            <p style="margin: 0; font-size: 14px; color: #333333; font-weight: 600;">The Monitora Team.</p>
                        </td>
                    </tr>

                    <!-- Help Section -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9f3f3; border-top: 1px solid #e8d4d4; text-align: center;">
                            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #5A2C2C;">Need Help Getting Started?</h4>
                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #666666; line-height: 1.5;">Our support team is here to help you make the most of Monitora.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="${process.env.APP_URL}" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Help Center</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 14px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="${process.env.APP_URL}" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Contact Support</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 14px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="${process.env.APP_URL}" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Documentation</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #e8d4d4; text-align: center;">
                            <p style="margin: 0 0 16px 0; font-size: 12px; color: #666666; line-height: 1.5;">This email was sent to ${email} because you were part of a project on Monitora.</p>
                            <p style="margin: 0 0 16px 0; font-size: 12px; color: #999999;">© 2025 Monitora by DASH Technology Management. All Rights Reserved</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 12px; color: #666666; text-decoration: none;">Privacy Policy</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 12px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 12px; color: #666666; text-decoration: none;">Terms of Service</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

export function taskTableBuilderForEmail(task: { title: string; due: string }) {
  return `
    <tr>
      <td style="padding: 0 40px 16px 40px;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
              <tr>
                  <td style="vertical-align: top; width: 100%;">
                      <p style="margin: 0 0 8px 0; font-size: 15px; font-weight: 600; color: #333333;">${task.title}</p>
                      <p style="margin: 0; font-size: 13px; color: #999999;">Assigned to: <span style="font-weight: 600; color: #666666;">You</span> • Due: ${task.due}</p>
                  </td>
                  <td style="text-align: right; vertical-align: top; white-space: nowrap; padding-left: 16px;">
                      <span style="display: inline-block; background-color: #fde8e8; color: #c54545; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">High</span>
                  </td>
              </tr>
          </table>
      </td>
    </tr>
  `;
}

export function sprintEndedEmailBuilder({
  name,
  email,
  sprint,
  task,
}: {
  name: string;
  email: string;
  sprint: {
    title: string;
    goals: string;
    duration: string;
    dueDate: string;
  };
  task: {
    total: number;
    completed: number;
    complete_rate: number;
  };
}) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>Sprint Completed - Monitora</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

                    <!-- Header with Logo -->
                    <tr>
                        <td style="padding: 24px 40px; background-color: #e8d4d4; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center;">
                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 8px;">
                                            <rect width="32" height="32" rx="4" fill="#5A2C2C"/>
                                            <path d="M9 8h14v2H9V8zm0 4h14v2H9v-2zm0 4h14v2H9v-2zm0 4h10v2H9v-2z" fill="#ffffff"/>
                                            <circle cx="22" cy="22" r="3" fill="#D4A574"/>
                                        </svg>
                                        <span style="font-size: 24px; font-weight: 700; color: #5A2C2C; vertical-align: middle;">Monitora</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Hero Illustration Banner -->
                    <tr>
                        <td style="padding: 0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="background: linear-gradient(135deg, #5A2C2C 0%, #7D3C3C 100%); padding: 40px; text-align: center;">
                                        <!-- Illustration placeholder -->
                                        <div style="background-color: rgba(255,255,255,0.1); border-radius: 8px; padding: 60px 20px; min-height: 140px;">
                                            <p style="color: #ffffff; font-size: 14px; margin: 0; opacity: 0.8;">
                                              <img src="https://res.cloudinary.com/domingo-bucket/image/upload/v1761170523/monitora/9006f48f-7795-49d2-abc0-c49b248d227f.png" style="width: 100%; height: auto;" />
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Heading -->
                    <tr>
                        <td style="padding: 32px 40px 16px 40px; text-align: center;">
                            <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #5A2C2C; line-height: 1.3;">Sprint Completed! 🎉</h1>
                        </td>
                    </tr>

                    <!-- Greeting -->
                    <tr>
                        <td style="padding: 16px 40px 16px 40px;">
                            <p style="margin: 0; font-size: 16px; color: #5A2C2C; font-weight: 600; line-height: 1.5;">Hi ${name},</p>
                        </td>
                    </tr>

                    <!-- Intro Text -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <p style="margin: 0; font-size: 15px; color: #666666; line-height: 1.6;">Congratulations! Your sprint has ended. Here's a summary of your accomplishments and key metrics from this sprint cycle.</p>
                        </td>
                    </tr>

                    <!-- Sprint Summary Card -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f9f3f3; border-radius: 8px; border: 1px solid #e8d4d4;">
                                <!-- Sprint Summary Header -->
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <td style="text-align: left;">
                                                    <span style="font-size: 16px; font-weight: 600; color: #5A2C2C;">Sprint Summary</span>
                                                </td>
                                                <td style="text-align: right;">
                                                    <span style="display: inline-block; background-color: #d4f4dd; color: #2d7a4d; padding: 6px 12px; border-radius: 16px; font-size: 13px; font-weight: 500;">
                                                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 4px;">
                                                            <circle cx="7" cy="7" r="6" stroke="#2d7a4d" stroke-width="2" fill="none"/>
                                                            <path d="M4 7l2 2 4-4" stroke="#2d7a4d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                                                        </svg>
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Sprint Title -->
                                <tr>
                                    <td style="padding: 0 24px 12px 24px;">
                                        <h2 style="margin: 0; font-size: 18px; font-weight: 600; color: #333333;">${sprint.title}</h2>
                                    </td>
                                </tr>

                                <!-- Description -->
                                <tr>
                                    <td style="padding: 0 24px 24px 24px;">
                                        <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">
                                          ${sprint.goals}
                                        </p>
                                    </td>
                                </tr>

                                <!-- Completion Rate Card -->
                                <tr>
                                    <td style="padding: 0 24px 24px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                            <tr>
                                                <td style="padding: 24px; text-align: center;">
                                                    <h3 style="margin: 0 0 8px 0; font-size: 36px; font-weight: 700; color: #D4A574;">${task.complete_rate}</h3>
                                                    <p style="margin: 0 0 4px 0; font-size: 14px; color: #666666; font-weight: 500;">Completion Rate</p>
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #333333;">${task.completed} of ${task.total} tasks completed</p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <!-- Sprint Stats Cards -->
                                <tr>
                                    <td style="padding: 0 24px 24px 24px;">
                                        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                            <tr>
                                                <!-- Duration Card -->
                                                <td style="width: 33%; padding-right: 8px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M4 9h16M9 4v2M15 4v2" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Duration</p>
                                                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #333333;">${sprint.duration}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Tasks Card -->
                                                <td style="width: 33%; padding-right: 8px;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <rect x="4" y="4" width="16" height="16" rx="2" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M8 8h8M8 12h8M8 16h5" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Tasks</p>
                                                                <p style="margin: 0; font-size: 16px; font-weight: 700; color: #333333;">${task.total}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>

                                                <!-- Due Date Card -->
                                                <td style="width: 34%;">
                                                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #ffffff; border-radius: 8px; border: 1px solid #e8d4d4;">
                                                        <tr>
                                                            <td style="padding: 16px; text-align: center;">
                                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-bottom: 8px;">
                                                                    <circle cx="12" cy="12" r="8" stroke="#5A2C2C" stroke-width="2" fill="none"/>
                                                                    <path d="M12 7v5l3 3" stroke="#5A2C2C" stroke-width="2" stroke-linecap="round"/>
                                                                </svg>
                                                                <p style="margin: 0; font-size: 12px; color: #999999; margin-bottom: 4px;">Due Date</p>
                                                                <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333;">${sprint.dueDate}</p>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Instructions Text -->
                    <tr>
                        <td style="padding: 0 40px 24px 40px;">
                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6; text-align: center;">Click the link below to View the complete sprint report and detailed analytics.</p>
                        </td>
                    </tr>

                    <!-- CTA Button -->
                    <tr>
                        <td style="padding: 0 40px 40px 40px; text-align: center;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                                <tr>
                                    <td style="border-radius: 6px; background-color: #5A2C2C;">
                                        <a href="${process.env.APP_URL}" style="display: inline-block; padding: 14px 32px; font-size: 15px; font-weight: 600; color: #ffffff; text-decoration: none;">
                                            View Sprint Report →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Separator -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="border-top: 1px solid #e8d4d4;"></td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Contact Text -->
                    <tr>
                        <td style="padding: 0 40px 16px 40px;">
                            <p style="margin: 0; font-size: 14px; color: #666666; line-height: 1.6;">Questions about the sprint results? Reach out to your project manager for a detailed information.</p>
                        </td>
                    </tr>

                    <!-- Sign Off -->
                    <tr>
                        <td style="padding: 0 40px 32px 40px;">
                            <p style="margin: 0 0 4px 0; font-size: 14px; color: #666666;">Best regards,</p>
                            <p style="margin: 0; font-size: 14px; color: #333333; font-weight: 600;">The Monitora Team.</p>
                        </td>
                    </tr>

                    <!-- Help Section -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f9f3f3; border-top: 1px solid #e8d4d4; text-align: center;">
                            <h4 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #5A2C2C;">Need Help Getting Started?</h4>
                            <p style="margin: 0 0 16px 0; font-size: 14px; color: #666666; line-height: 1.5;">Our support team is here to help you make the most of Monitora.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Help Center</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 14px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Contact Support</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 14px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 14px; color: #5A2C2C; text-decoration: none; font-weight: 500;">Documentation</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #e8d4d4; text-align: center;">
                            <p style="margin: 0 0 16px 0; font-size: 12px; color: #666666; line-height: 1.5;">This email was sent to ${email} because you were invited to join Monitora.</p>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 16px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align: middle; margin-right: 4px;">
                                            <circle cx="8" cy="8" r="7" stroke="#999999" stroke-width="1.5" fill="none"/>
                                            <path d="M8 4.5c-1.933 0-3.5 1.567-3.5 3.5s1.567 3.5 3.5 3.5 3.5-1.567 3.5-3.5-1.567-3.5-3.5-3.5zm0 6c-1.379 0-2.5-1.121-2.5-2.5S6.621 5.5 8 5.5s2.5 1.121 2.5 2.5-1.121 2.5-2.5 2.5z" fill="#999999"/>
                                        </svg>
                                        <span style="font-size: 12px; color: #999999; vertical-align: middle;">2025 Monitora by DASH Technology Management. All Rights Reserved</span>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tr>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 12px; color: #666666; text-decoration: none;">Privacy Policy</a>
                                    </td>
                                    <td style="text-align: center; color: #cccccc; font-size: 12px;">•</td>
                                    <td style="text-align: center; padding: 0 8px;">
                                        <a href="#" style="font-size: 12px; color: #666666; text-decoration: none;">Terms of Service</a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
  `;
}

export function clientReportEmailBuilder({
  client,
  sprint,
}: {
  client: { name: string };
  sprint: { progress: number; goal: string; projectName: string };
}) {
  return `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
  <head>
    <meta name="viewport" content="width=device-width" />
    <link rel="preload" as="image" href="https://res.cloudinary.com/domingo-bucket/image/upload/v1760946203/monitora/b669024f-74c5-47e7-8b93-e44992d78f42.png" />
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="x-apple-disable-message-reformatting" />
    <meta
      name="format-detection"
      content="telephone=no,address=no,email=no,date=no,url=no" />
    <meta name="color-scheme" content="light" />
    <meta name="supported-color-schemes" content="light" />
    <style>
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        mso-font-alt: 'sans-serif';
        src: url(https://rsms.me/inter/font-files/Inter-Regular.woff2?v=3.19) format('woff2');
      }

      * {
        font-family: 'Inter', sans-serif;
      }
    </style>
    <style>
      blockquote,h1,h2,h3,img,li,ol,p,ul{margin-top:0;margin-bottom:0}@media only screen and (max-width:425px){.tab-row-full{width:100%!important}.tab-col-full{display:block!important;width:100%!important}.tab-pad{padding:0!important}}
    </style>
  </head>
  <body style="background-color:#ffffff">
    <!--$-->
    <table
      border="0"
      width="100%"
      cellpadding="0"
      cellspacing="0"
      role="presentation"
      align="center">
      <tbody>
        <tr>
          <td
            style="margin:0px;background-color:#ffffff;padding-top:0px;padding-right:0px;padding-bottom:0px;padding-left:0px">
            <table
              align="center"
              width="100%"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              style="max-width:600px;width:100%;margin-left:auto;margin-right:auto;border-style:solid;background-color:#ffffff;min-width:300px;padding-top:8px;padding-right:8px;padding-bottom:8px;padding-left:8px;border-radius:0px;border-width:0px;border-color:transparent">
              <tbody>
                <tr style="width:100%">
                  <td>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="margin-top:0px;margin-bottom:0px">
                      <tbody style="width:100%">
                        <tr style="width:100%">
                          <td align="left" data-id="__react-email-column">
                            <img src="https://res.cloudinary.com/domingo-bucket/image/upload/v1760946203/monitora/b669024f-74c5-47e7-8b93-e44992d78f42.png" alt="Monitora Logo" width="40" height="48" style="vertical-align: middle; margin-right: 4px;">
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <table
                      align="center"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation"
                      style="max-width:37.5em;height:64px">
                      <tbody>
                        <tr style="width:100%">
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <h2
                      style="margin-left:0px;margin-right:0px;margin-top:0px;margin-bottom:12px;text-align:left;color:#111827;font-size:30px;line-height:36px;font-weight:700">
                      <strong>Weekly project report</strong>
                    </h2>
                    <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                      Hello ${client.name}, please find below your weekly report
                      for your projects on Monitora.
                    </p>
                    <hr
                      style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
                    <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                      Project Name: ${sprint.projectName}
                    </p>
                      <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                      Current Sprint goal: ${sprint.goal}
                    </p>
                    <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                      Current Sprint progress:
                    </p>
                    <table
                      align="left"
                      width="100%"
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      role="presentation">
                      <tbody>
                        <tr style="width:100%">
                          <td style="width:100%">
                            <div
                              style="padding: 1px; background-color: #ededed;border-radius: 30px; overflow: hidden;">
                              <div
                                style="width: ${sprint.progress}%; background-color: #69131b; padding: 5px 0px;"></div>
                            </div>
                            <b>${sprint.progress}%</b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <hr
                      style="width:100%;border:none;border-top:1px solid #eaeaea;margin-top:32px;margin-bottom:32px" />
                    <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                    </p>
                    <p
                      style="font-size:15px;line-height:26.25px;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;color:#374151;margin:0 0 20px 0;margin-top:0;margin-right:0;margin-bottom:20px;margin-left:0">
                      Regards,<br />The Monitora Team
                    </p>
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      </tbody>
    </table>
    <!--7--><!--/$-->
  </body>
</html>

  `;
}

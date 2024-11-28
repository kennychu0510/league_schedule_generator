'use server';
import nodemailer from 'nodemailer';
import { ServerActionResponse } from './interface';

const auth = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASSWORD,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function SendEmail({ schedule, recipient, title }: { schedule: string; recipient: string; title: string }): Promise<ServerActionResponse<null>> {
  // Create a transporter object using Gmail SMTP
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth,
  });

  // Send the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(
      {
        from: auth.user,
        to: recipient,
        subject: title,
        attachments: [
          {
            filename: 'Squash_League_Schedule_Division_Division 3_Kowloon Cricket Club 3B.ics',
            content: schedule,
          },
        ],
      },
      (error) => {
        if (error) {
          resolve({
            status: 'failed',
            message: 'Failed to send email',
          });
        } else {
          reject({
            status: 'success',
            message: 'Email sent successfully',
          });
        }
      }
    );
  });
}

import { NextRequest, NextResponse } from 'next/server';

// To handle a GET request to /api
export async function GET(request: NextRequest) {
  // Do whatever you want
  // search params
  const division = request.nextUrl.searchParams.get('division');
  const team = request.nextUrl.searchParams.get('team');
  const schedule = request.nextUrl.searchParams.get('schedule');

  if (!division || !team || !schedule) {
    return new NextResponse('Failed to generate calendar file', {
      status: 400,
      statusText: 'Bad Request',
    });
  }

  const fileName = `Squash_League_Schedule_Division_${division}_${team}.ics`;

  return new NextResponse(schedule, {
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/calendar',
      'Content-Disposition': `attachment; filename="${fileName}"`,
    },
  });
}

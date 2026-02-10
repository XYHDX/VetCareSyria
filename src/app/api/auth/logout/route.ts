import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ success: true });

    response.cookies.delete('admin_session');

    return response;
}

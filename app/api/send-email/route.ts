import { NextRequest, NextResponse } from '@/node_modules/next/server';
import { ISend } from '@/utils/services/mailService';
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SG_API_KEY as string);

export async function POST(req: NextRequest) {
    const body = await req.json();
    const { to }: ISend = body.data;
    const msg = {
        to,
        from: process.env.NEXT_PUBLIC_EMAIL_USER as string,
        subject: "Message",
        text: `message`,
        html: `
            <h2>message</h2>
        `,
    };
    try {
        await sgMail.send(msg);
        return NextResponse.json("ok");
    } catch (error) {
        console.error(error);
        return NextResponse.error();
    }
}
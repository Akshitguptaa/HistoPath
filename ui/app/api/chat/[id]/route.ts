import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { id } = await params;

        const chat = await prisma.chat.findUnique({
            where: { id },
        });

        if (!chat) {
            return new NextResponse("Not Found", { status: 404 });
        }

        if (chat.userId !== userId) {
            return new NextResponse("Forbidden", { status: 403 });
        }

        await prisma.chat.delete({
            where: { id },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error("[CHAT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki.").max(80),
  role: z.string().min(2, "Rola lub firma musi mieć co najmniej 2 znaki.").max(100),
  avatar: z.union([z.string().url("Adres avatara musi być pełnym adresem URL.").max(2000), z.literal("")]).default(""),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(10, "Treść opinii musi mieć co najmniej 10 znaków.").max(1000),
});

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return forbidden();
  if (!isSameOrigin(request)) return forbidden();

  try {
    const { id } = await params;
    return NextResponse.json(await prisma.testimonial.update({ where: { id }, data: schema.parse(await request.json()) }));
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.issues[0]?.message }, { status: 400 });
    return invalidRequest();
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await requireAdmin()) return forbidden();
  if (!isSameOrigin(request)) return forbidden();

  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch {
    return invalidRequest();
  }
}

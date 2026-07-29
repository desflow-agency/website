import { forbidden, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function GET(){if(!await requireAdmin())return forbidden();return NextResponse.json(await prisma.message.findMany({orderBy:{createdAt:"desc"}}));}

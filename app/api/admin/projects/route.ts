import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema=z.object({title:z.string().min(2).max(100),client:z.string().min(2).max(100),category:z.string().min(2).max(50),image:z.string().url().max(2000),description:z.string().min(10).max(1000),date:z.coerce.date().optional()});
export async function GET(){if(!await requireAdmin())return forbidden();return NextResponse.json(await prisma.project.findMany({orderBy:{date:"desc"}}));}
export async function POST(request:Request){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{return NextResponse.json(await prisma.project.create({data:schema.parse(await request.json())}),{status:201});}catch{return invalidRequest();}}

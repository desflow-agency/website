import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const promotionSchema=z.object({serviceId:z.string().min(1),percent:z.number().int().min(1).max(90),startsAt:z.coerce.date(),endsAt:z.coerce.date(),active:z.boolean().default(true)}).refine(x=>x.endsAt>x.startsAt,{message:"End date must follow start date"});
export async function GET(){if(!await requireAdmin())return forbidden(); return NextResponse.json(await prisma.promotion.findMany({include:{service:true},orderBy:{startsAt:"desc"}}));}
export async function POST(req:Request){if(!await requireAdmin())return forbidden();if(!isSameOrigin(req))return forbidden();try{return NextResponse.json(await prisma.promotion.create({data:promotionSchema.parse(await req.json())}),{status:201});}catch{return invalidRequest();}}

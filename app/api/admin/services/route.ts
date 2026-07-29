import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const serviceSchema=z.object({title:z.string().min(2).max(80),description:z.string().min(10).max(500),price:z.number().int().positive(),icon:z.string().max(40).default("Sparkles"),position:z.number().int().nonnegative().default(0)});
export async function GET(){if(!await requireAdmin()) return forbidden(); return NextResponse.json(await prisma.service.findMany({include:{promotion:true},orderBy:{position:"asc"}}));}
export async function POST(req:Request){if(!await requireAdmin()) return forbidden(); if(!isSameOrigin(req)) return forbidden(); try{return NextResponse.json(await prisma.service.create({data:serviceSchema.parse(await req.json())}),{status:201});}catch{return invalidRequest();}}

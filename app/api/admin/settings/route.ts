import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema=z.object({name:z.string().min(2).max(80),email:z.string().email(),phone:z.string().min(4).max(40),address:z.string().min(2).max(200),primaryColor:z.string().regex(/^#[0-9a-fA-F]{6}$/),heroTitle:z.string().min(5).max(200),ctaTitle:z.string().min(5).max(200)});
export async function GET(){if(!await requireAdmin())return forbidden();return NextResponse.json(await prisma.siteSettings.upsert({where:{id:"default"},update:{},create:{id:"default"}}));}
export async function PUT(request:Request){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const data=schema.parse(await request.json());return NextResponse.json(await prisma.siteSettings.upsert({where:{id:"default"},update:data,create:{id:"default",...data}}));}catch{return invalidRequest();}}

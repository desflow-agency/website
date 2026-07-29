import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
const schema = z.object({name:z.string().min(2).max(80),email:z.string().email(),phone:z.string().max(30).optional(),company:z.string().max(100).optional(),body:z.string().min(10).max(2000)});
export async function POST(request: Request){ try { const origin=request.headers.get("origin"); if(origin && origin !== new URL(request.url).origin) return NextResponse.json({error:"Nieprawidłowe żądanie."},{status:403}); const data=schema.parse(Object.fromEntries(await request.formData())); await prisma.message.create({data}); return NextResponse.redirect(new URL("/#contact",request.url),303); } catch { return NextResponse.json({error:"Nieprawidłowe dane formularza."},{status:400}); } }

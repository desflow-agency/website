import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ title:z.string().min(2).max(80), description:z.string().min(10).max(500), price:z.number().int().positive(), icon:z.string().max(40).default("Sparkles"), position:z.number().int().nonnegative().default(0) });
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) { if(!await requireAdmin()) return forbidden(); if(!isSameOrigin(request)) return forbidden(); try { const {id}=await params; return NextResponse.json(await prisma.service.update({where:{id},data:schema.parse(await request.json())})); } catch { return invalidRequest(); } }
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}) { if(!await requireAdmin()) return forbidden(); if(!isSameOrigin(request)) return forbidden(); try { const {id}=await params; await prisma.service.delete({where:{id}}); return new NextResponse(null,{status:204}); } catch { return invalidRequest(); } }

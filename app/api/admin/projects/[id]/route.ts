import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema=z.object({title:z.string().min(2).max(100),client:z.string().min(2).max(100),category:z.string().min(2).max(50),image:z.string().url().max(2000),description:z.string().min(10).max(1000),date:z.coerce.date()});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;return NextResponse.json(await prisma.project.update({where:{id},data:schema.parse(await request.json())}));}catch{return invalidRequest();}}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;await prisma.project.delete({where:{id}});return new NextResponse(null,{status:204});}catch{return invalidRequest();}}

import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
const schema=z.object({status:z.enum(["UNREAD","READ"])});
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;return NextResponse.json(await prisma.message.update({where:{id},data:schema.parse(await request.json())}));}catch{return invalidRequest();}}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;await prisma.message.delete({where:{id}});return new NextResponse(null,{status:204});}catch{return invalidRequest();}}

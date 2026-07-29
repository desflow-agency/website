import { forbidden, invalidRequest, isSameOrigin, requireAdmin } from "@/lib/admin-api";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({ percent:z.number().int().min(1).max(90), startsAt:z.coerce.date(), endsAt:z.coerce.date(), active:z.boolean() }).refine(x=>x.endsAt>x.startsAt);
export async function PATCH(request:Request,{params}:{params:Promise<{id:string}>}) { if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;return NextResponse.json(await prisma.promotion.update({where:{id},data:schema.parse(await request.json())}));}catch{return invalidRequest();}}
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}) {if(!await requireAdmin())return forbidden();if(!isSameOrigin(request))return forbidden();try{const {id}=await params;await prisma.promotion.delete({where:{id}});return new NextResponse(null,{status:204});}catch{return invalidRequest();}}

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
  try{
    const {id} = await params;
    const { userId } = await auth();
    
    if(!userId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const project = await prisma.project.findFirst({
      where: {
        userId: userId,
        id: id,
      },
      include: {
        frames: true,
      }
    });

    if(!project){
      return NextResponse.json({
        success: false,
        error: "Project not found",
      }, 
      {status: 404}
      )
    }

    return NextResponse.json({
      success: true,
      data: project,
    });
  }catch(error){
    console.log("Error occured", error);
    return NextResponse.json({
        success: false,
        error: "Failed to fetch project",
      },
      {status: 500}
    );
  
  }
}

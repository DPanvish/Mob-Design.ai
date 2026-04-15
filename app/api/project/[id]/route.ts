import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

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


export const POST = async(request: Request, {params}: {params: Promise<{id: string}>}) => {
  try{
    const {id} = await params;
    const { userId } = await auth();

    if(!userId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let prompt = "";
    try {
      const body = (await request.json()) as { prompt?: unknown };
      prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    if(!prompt){
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id, 
        userId
      },
      include: {
        frames: true,
      }
    });

    if(!project){
      throw new Error("Project not found");
    }

    try{
      await inngest.send({
        name: "ui/generate.screens",
        data: {
          userId,
          projectId: id,
          prompt,
          frames: project?.frames,
          theme: project?.theme,
        }
      })
    }catch(error){
      console.log("Error occured", error);
    }

    return NextResponse.json({
      success: true,
    });

  }catch(error){
    console.log("Error occured", error);
    return NextResponse.json({
        success: false,
        error: "Failed to generate frame",
      },
      {status: 500}
    );
  }
}

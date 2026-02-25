import { generateProjectName } from "@/app/action/action";
import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const GET = async() => {
  try{
    const { userId } = await auth();

    if(!userId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: userId,
      },
      take: 10,
      orderBy: {createdAt: "desc"},
    });

    return NextResponse.json({
      success: true,
      data: projects,
    });
  }catch(error){
    console.log("Error occured", error);

    return NextResponse.json({
        success: false,
        error: "Failed to fetch projects",
      },
      {status: 500}
    );
  }
}

export const POST = async(request: Request) => {
  try{
    const {prompt} = await request.json();
    const { userId } = await auth();

    if(!userId){
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    if(!prompt){
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const projectName = await generateProjectName(prompt)

    const project = await prisma.project.create({
      data: {
        userId,
        name: projectName
      }
    });

    return NextResponse.json({
      success: true,
      data: project,
    });

  }catch(error){
    console.log("Error occured", error);
    return NextResponse.json({
        success: false,
        error: "Failed to create project",
      },
      {status: 500}
    );
  }
}
import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// GET /api/tasks - Get all tasks
export async function GET() {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get tasks for the current user
    const tasks = await prisma.task.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        position: "asc",
      },
    })

    return NextResponse.json(tasks)
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { text, timeframe } = body

    if (!text || !timeframe) {
      return NextResponse.json({ error: "Text and timeframe are required" }, { status: 400 })
    }

    // Get the highest position for this timeframe and user
    const highestPositionTask = await prisma.task.findFirst({
      where: {
        timeframe,
        userId: user.id,
      },
      orderBy: { position: "desc" },
    })

    const position = highestPositionTask ? highestPositionTask.position + 1 : 0

    // Create the task for the current user
    const task = await prisma.task.create({
      data: {
        text,
        timeframe,
        position,
        completed: false,
        userId: user.id,
      },
    })

    return NextResponse.json(task)
  } catch (error) {
    console.error("Error creating task:", error)
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 })
  }
}

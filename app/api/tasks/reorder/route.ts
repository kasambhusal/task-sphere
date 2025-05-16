import { type NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"

// PUT /api/tasks/reorder - Reorder tasks
export async function PUT(request: NextRequest) {
  try {
    // Get the current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { tasks, timeframe } = body

    if (!tasks || !timeframe || !Array.isArray(tasks)) {
      return NextResponse.json({ error: "Tasks array and timeframe are required" }, { status: 400 })
    }

    // Verify all tasks belong to the current user
    const taskIds = tasks.map((task) => task.id)
    const userTasks = await prisma.task.findMany({
      where: {
        id: { in: taskIds },
        userId: user.id,
      },
    })

    if (userTasks.length !== taskIds.length) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Start a transaction to ensure all updates happen together
    const result = await prisma.$transaction(
      tasks.map((task, index) =>
        prisma.task.update({
          where: { id: task.id },
          data: { position: index },
        }),
      ),
    )

    return NextResponse.json({ success: true, count: result.length })
  } catch (error) {
    console.error("Error reordering tasks:", error)
    return NextResponse.json({ error: "Failed to reorder tasks" }, { status: 500 })
  }
}

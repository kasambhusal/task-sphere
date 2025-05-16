"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Reorder, motion, AnimatePresence } from "framer-motion"
import { GripVertical, CheckCircle2, Circle, Trash2, Loader2, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "./auth-provider"

// Define task interface
interface Task {
  id: string
  text: string
  completed: boolean
  timeframe: "daily" | "weekly" | "monthly" | "yearly"
  position: number
}

export default function TaskSphere() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [activeTab, setActiveTab] = useState<string>("daily")
  const [newTaskText, setNewTaskText] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user, logout } = useAuth()

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => task.timeframe === activeTab).sort((a, b) => a.position - b.position)

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/tasks")

      if (!response.ok) {
        throw new Error("Failed to fetch tasks")
      }

      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
      // Show error toast or notification
    } finally {
      setIsLoading(false)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Add a new task
  const addTask = async () => {
    if (newTaskText.trim() === "") return

    try {
      setIsSubmitting(true)

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: newTaskText,
          timeframe: activeTab,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const newTask = await response.json()
      setTasks([...tasks, newTask])
      setNewTaskText("")
    } catch (error) {
      console.error("Error adding task:", error)
      // Show error toast or notification
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle task completion
  const toggleComplete = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !completed,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const updatedTask = await response.json()

      setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: updatedTask.completed } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
      // Show error toast or notification
    }
  }

  // Delete a task with confirmation
  const deleteTask = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        })

        if (!response.ok) {
          throw new Error("Failed to delete task")
        }

        setTasks(tasks.filter((task) => task.id !== id))
      } catch (error) {
        console.error("Error deleting task:", error)
        // Show error toast or notification
      }
    }
  }

  // Handle reordering of tasks
  const handleReorder = async (reorderedTasks: Task[]) => {
    // Update local state immediately for a responsive UI
    const newTasks = tasks.map((task) => {
      if (task.timeframe !== activeTab) return task

      const reorderedTask = reorderedTasks.find((t) => t.id === task.id)
      if (reorderedTask) {
        const newPosition = reorderedTasks.findIndex((t) => t.id === task.id)
        return { ...task, position: newPosition }
      }

      return task
    })

    setTasks(newTasks)

    // Then update the server
    try {
      const response = await fetch("/api/tasks/reorder", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: reorderedTasks.map((task, index) => ({
            id: task.id,
            position: index,
          })),
          timeframe: activeTab,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to reorder tasks")
        // If the server update fails, we could revert the local state here
      }
    } catch (error) {
      console.error("Error reordering tasks:", error)
      // Show error toast or notification
      // Refresh tasks from the server to ensure consistency
      fetchTasks()
    }
  }

  return (
    <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">TaskSphere</h1>
            <p className="opacity-80">Organize your tasks by timeframe</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-80">{user?.name || user?.email}</span>
            <button
              onClick={logout}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="daily" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="px-6 pt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </div>

        <div className="p-6">
          {/* Add new task input */}
          <div className="flex mb-6">
            <input
              type="text"
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              placeholder={`Add a new ${activeTab} task...`}
              className="flex-1 p-3 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isSubmitting}
            />
            <button
              onClick={addTask}
              className="bg-purple-600 text-white px-4 rounded-r-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Add"}
            </button>
          </div>

          {/* Task lists for each timeframe */}
          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              </div>
            ) : (
              <AnimatePresence>
                {filteredTasks.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-8 text-gray-500"
                  >
                    No {activeTab} tasks yet. Add one above!
                  </motion.div>
                ) : (
                  <Reorder.Group axis="y" values={filteredTasks} onReorder={handleReorder} className="space-y-2">
                    {filteredTasks.map((task) => (
                      <Reorder.Item
                        key={task.id}
                        value={task}
                        as="div"
                        className={cn(
                          "bg-white border rounded-lg p-3 flex items-center gap-3 cursor-grab active:cursor-grabbing",
                          "shadow-sm hover:shadow transition-all duration-200",
                          task.completed && "bg-gray-50 text-gray-500",
                        )}
                        whileDrag={{
                          scale: 1.05,
                          backgroundColor: "#f0f9ff",
                          boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                          zIndex: 10,
                        }}
                        dragListener={true}
                        dragControls={undefined}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      >
                        <div className="text-gray-400">
                          <GripVertical size={20} />
                        </div>

                        <button onClick={() => toggleComplete(task.id, task.completed)} className="flex-shrink-0">
                          {task.completed ? (
                            <CheckCircle2 className="text-green-500" size={20} />
                          ) : (
                            <Circle className="text-gray-300" size={20} />
                          )}
                        </button>

                        <span className={cn("flex-1", task.completed && "line-through")}>{task.text}</span>

                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )}
              </AnimatePresence>
            )}
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

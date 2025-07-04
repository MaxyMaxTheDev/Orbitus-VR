
"use client";

import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  task: z.string().min(1, 'Task cannot be empty'),
});

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

type FormValues = z.infer<typeof formSchema>;

export function Workspace() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, text: 'Finalize NexusVR launch trailer', completed: false },
    { id: 2, text: 'Debug spatial audio glitches', completed: false },
    { id: 3, text: 'Plan Q3 roadmap', completed: true },
  ]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const newTask: Task = {
      id: Date.now(),
      text: data.task,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
    reset();
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div className="h-full w-full p-4 flex justify-center items-center">
      <Card className="w-full max-w-2xl h-full flex flex-col bg-transparent border-primary/30">
        <CardHeader>
          <CardTitle className="text-accent text-xl tracking-wider">My Workspace</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4 pt-0">
          <form onSubmit={handleSubmit(onSubmit)} className="flex items-center gap-2">
            <Input
              {...register('task')}
              placeholder="Add a new task..."
              autoComplete="off"
              className="flex-1 bg-black/30 border-primary/50 focus:ring-accent"
            />
            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/80">
              <Plus className="w-4 h-4" />
            </Button>
          </form>
          {errors.task && <p className="text-destructive text-xs -mt-2 ml-1">{errors.task.message}</p>}
          
          <p className="text-sm text-muted-foreground">Tasks</p>

          <ScrollArea className="flex-1 -mx-4 pr-4">
            <div className="space-y-2 px-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center p-3 rounded-lg bg-black/20 hover:bg-black/40 transition-colors group"
                >
                  <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    className="mr-3 h-5 w-5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                  />
                  <label
                    htmlFor={`task-${task.id}`}
                    className={cn(
                      "flex-1",
                      task.completed ? "line-through text-muted-foreground" : "text-foreground"
                    )}
                  >
                    {task.text}
                  </label>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteTask(task.id)}
                    className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive hover:bg-destructive/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}

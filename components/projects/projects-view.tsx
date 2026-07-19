"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { NewProjectDialog } from "@/components/projects/new-project-dialog";
import { PROJECTS, type Project } from "@/lib/mock/projects";
import { ORG } from "@/lib/mock/settings";

export function ProjectsView() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS);
  const [newOpen, setNewOpen] = useState(false);

  const addProject = (p: Project) => setProjects((xs) => (xs.some((x) => x.id === p.id) ? xs : [p, ...xs]));

  return (
    <div className="mx-auto max-w-295 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[1.375rem] font-bold tracking-tight">Projects</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {projects.length} projects in {ORG.name}
          </p>
        </div>
        <Button onClick={() => setNewOpen(true)}>
          <Plus size={14} /> New project
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>

      <NewProjectDialog open={newOpen} onOpenChange={setNewOpen} onCreate={addProject} />
    </div>
  );
}

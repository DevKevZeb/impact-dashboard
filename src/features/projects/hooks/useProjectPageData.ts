// projects/hooks/useProjectPageData.ts
import { useParams } from "react-router-dom";
import { useProgram } from "@/features/programs/api/programQueries";
import { useProject } from "../hooks/useProjects";

type Mode = "create" | "edit";

export function useProjectPageData(mode: Mode) {
  const { programId, projectId } = useParams();

  const parsedProgramId = Number(programId);
  const parsedProjectId = projectId ? Number(projectId) : undefined;

  const isValidProgramId = !Number.isNaN(parsedProgramId);
  const isValidProjectId =
    mode === "edit" &&
    parsedProjectId !== undefined &&
    !Number.isNaN(parsedProjectId);

  const programQuery = useProgram(isValidProgramId ? parsedProgramId : 0);

  const projectQuery = useProject(
    mode === "edit" && isValidProjectId ? parsedProjectId : undefined
  );

  return {
    programId: parsedProgramId,
    projectId: parsedProjectId,
    isValidProgramId,
    isValidProjectId,
    programQuery,
    projectQuery,
  };
}

import { Loader2 } from "lucide-react";
import { useProjectPageData } from "../hooks/useProjectPageData";
import { useProjectForm } from "../hooks/useProjectForm";
import ProjectFormView from "../components/ProjectFormView";
import { useCreateProject } from "../hooks/useCreateProject";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FieldErrors } from "node_modules/react-hook-form/dist/types/errors";

interface Props {
  mode: "create" | "edit";
}

export default function CreateProjectPage({mode}: Props) {
    const { programId, projectId, isValidProgramId, isValidProjectId, programQuery, projectQuery } = useProjectPageData(mode);
    const form = useProjectForm( mode, programId, projectQuery.data);

    const { mutateAsync: createProject} = useCreateProject();
    const { mutateAsync: updateProject } = useUpdateProject();

    const navigate = useNavigate();

    if (!isValidProgramId) return <div>Invalid program</div>;
    if (mode === "edit" && !isValidProjectId) return <div>Invalid project</div>;

    if (programQuery.isLoading || projectQuery.isLoading) {
        return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="animate-spin" />
        </div>
        );
    }

    const onSubmit = async (data: any) => {
        console.log("Submitting data:", data);
        if(mode === "edit" && projectId !== undefined) {
            await updateProject({ id: projectId, dto: data });
        } else {
            await createProject(data);
        }
        navigate(`/app/projects/program/${programId}`);
    };

    const onInvalid = (errors: FieldErrors) => { toast.error("Please fix the highlighted errors before submitting."); console.log(errors)}

    if (programQuery.error) return <div>Error loading program</div>;
    if (mode === "edit" && projectQuery.error) return <div>Error loading project</div>;
    
    return (
        <ProjectFormView
            mode={mode}
            programName={programQuery.data?.name}
            form={form}
            onSubmit={onSubmit}
            onInvalid={onInvalid}
        />
    );
}
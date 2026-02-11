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

    if (programQuery.isLoading || programQuery.isFetching ||projectQuery.isLoading || projectQuery.isFetching ) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4">
                <Loader2 className="loader-default" />
                <p className="text-gray-500">Loading...</p>
            </div>
        </div>
        );
    }

    const onSubmit = async (data: any) => {
        if(mode === "edit" && projectId !== undefined) {
            form.form.reset(data, { keepDirty: true });
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
        <ProjectFormView mode={mode} programName={programQuery.data?.name} programId={programQuery.data?.id} form={form} onSubmit={onSubmit} onInvalid={onInvalid} />
    );
}
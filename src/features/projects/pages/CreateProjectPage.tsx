import { Loader2 } from "lucide-react";
import { useProjectPageData } from "../hooks/useProjectPageData";
import { useProjectForm } from "../hooks/useProjectForm";
import ProjectFormView from "../components/ProjectFormView";
import { useCreateProject } from "../hooks/useCreateProject";
import { useUpdateProject } from "../hooks/useUpdateProject";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import { useAuthStore } from "@/features/auth/store/authStore";
import type { UseProjectFormReturn } from "../hooks/useProjectForm";
import type { ProjectDTO } from "../types/project.types";

interface Props {
  mode: "create" | "edit";
}

type ProjectFormValues = UseProjectFormReturn["form"] extends UseFormReturn<infer T> ? T : never;

export default function CreateProjectPage({mode}: Props) {
    const { programId, projectId, isValidProgramId, isValidProjectId, programQuery, projectQuery } = useProjectPageData(mode);
    const form = useProjectForm( mode, programId, projectQuery.data);

    const { mutateAsync: createProject} = useCreateProject();
    const { mutateAsync: updateProject } = useUpdateProject();

    const navigate = useNavigate();
    const user = useAuthStore((s) => s.user);
    const isCountryActive = user?.country_user_role?.country?.active ?? true;

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

    if (mode === "create" && !isCountryActive) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 max-w-md">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-600 font-medium">Projects cannot be created</p>
                    <p className="text-sm text-gray-600">Your country is not active. Contact an administrator to activate it.</p>
                </div>
            </div>
        );
    }

    if (mode === "edit" && !isCountryActive) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4 max-w-md">
                    <span className="text-2xl">⚠️</span>
                    <p className="text-red-600 font-medium">Projects cannot be edited</p>
                    <p className="text-sm text-gray-600">Your country is not active. Contact an administrator to activate it.</p>
                </div>
            </div>
        );
    }

    const onSubmit = async (data: ProjectFormValues) => {
        if(mode === "edit" && projectId !== undefined) {
            form.form.reset(data, { keepDirty: true });
            await updateProject({ id: projectId, dto: data as unknown as ProjectDTO });
        } else {
            await createProject(data as unknown as ProjectDTO);
        }
        navigate("/app/projects");
    };

    const onInvalid = (errors: FieldErrors<ProjectFormValues>) => { toast.error("Please fix the highlighted errors before submitting."); console.log(errors)}

    if (programQuery.error) return <div>Error loading program</div>;
    if (mode === "edit" && projectQuery.error) return <div>Error loading project</div>;
    
    return (
        <ProjectFormView mode={mode} programName={programQuery.data?.name} programId={programQuery.data?.id} projectId={projectId} form={form} onSubmit={onSubmit} onInvalid={onInvalid} />
    );
}
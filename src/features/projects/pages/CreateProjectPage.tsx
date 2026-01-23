import { Loader2 } from "lucide-react";
import { useProjectPageData } from "../hooks/useProjectPageData";
import { useProjectForm } from "../hooks/useProjectForm";
import ProjectFormView from "../components/ProjectFormView";
//import { fetchDonorsForSelect } from "@/features/donors/services/donor.api";

interface Props {
  mode: "create" | "edit";
}

export default function CreateProjectPage({mode}: Props) {
    const { programId, isValidProgramId, isValidProjectId, programQuery, projectQuery } = useProjectPageData(mode);

    const form = useProjectForm( mode, programId, projectQuery.data);

    if (!isValidProgramId) return <div>Invalid program</div>;
    if (mode === "edit" && !isValidProjectId) return <div>Invalid project</div>;

    if (programQuery.isLoading || projectQuery.isLoading) {
        return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <Loader2 className="animate-spin" />
        </div>
        );
    }

    if (programQuery.error) {
        return <div>Error loading program</div>;
    }

    if (mode === "edit" && projectQuery.error) {
        return <div>Error loading project</div>;
    }


    const onSubmit = (data: any) => {
        console.log("SUBMIT", data);
    };

    const onInvalid = (errors: any) => {
        console.log("INVALID", errors);
    };

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
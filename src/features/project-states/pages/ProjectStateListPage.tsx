import { Loader2, Plus, Search, Tag } from "lucide-react";
import { useState } from "react";
import type { ProjectState, ProjectStateDTO } from "../types/projectstate.types";
import { useProjectStates } from "../hooks/useProjectStates";
import { useCreateProjectState } from "../hooks/useCreateProjectState";
import { useUpdateProjectState } from "../hooks/useUpdateProjectState";
import CreateProjectStateModal from "../components/CreateProjectStateModal";
import { EmptyState } from "@/shared/components/EmptyState";
import ProjectStateTable from "../components/ProjectStateTable";
import { Button } from "@/components/ui/button";

export default function ProjectStateListPage(){

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const { data, isLoading, error } = useProjectStates(page,perPage);

    const { mutateAsync: createProjectState} = useCreateProjectState();
    const { mutateAsync: updateProjectState } = useUpdateProjectState();

    const [openModal, setOpenModal] = useState(false);
    const [selectedProjectState, setSelectedProjectState] = useState<ProjectState | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const  handleSubmit = async (formData: ProjectStateDTO) => {
        if(selectedProjectState) await updateProjectState({ id: selectedProjectState.id, dto: formData});
        else {
            await createProjectState(formData);
            setPage(1);
        }
        setOpenModal(false);
    }

    const handleOpenCreate = () => {
        setSelectedProjectState(null);
        setOpenModal(true);
    }

    const handleEdit = async (projectState: ProjectState) => {
        setSelectedProjectState(projectState);
        setOpenModal(true);
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
        <p className="text-gray-500">Loading Project States...</p>
        </div>
    </div>
    );
    {error && <p>Error loading project states</p>}

    return(
        <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="page-title">Project States</h1>   
                    <p className="page-description">
                        Manage the Project States
                    </p> 
                </div>
                    <Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
                    <Plus className="w-5 h-5 mr-2"/>
                    New Project State
                    </Button>
                </div>
                
                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                    type="text"
                    placeholder="Search by state ..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-default"
                    />
                </div>

            <CreateProjectStateModal open={openModal} projectState={selectedProjectState} onClose={() => setOpenModal(false)} onSubmit={handleSubmit}/>
            {data && data.project_states.length > 0 ? 
                <ProjectStateTable projectStates={data?.project_states} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={(projectState) => console.log("DELETE", projectState)}/>
                :
                <EmptyState 
                icon={Tag} title={searchTerm ? "No project States found" : "No project states available"}
                description={
                    searchTerm ? "Try adjusting your search terms" : "Click 'New Project State' to create your first Project State"
                }/>}
        </div>
    )
}
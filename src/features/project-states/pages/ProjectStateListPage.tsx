import { Loader2, Plus, Search, Tag } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ProjectState, ProjectStateDTO } from "../types/projectstate.types";
import { useProjectStates } from "../hooks/useProjectStates";
import { useCreateProjectState } from "../hooks/useCreateProjectState";
import { useUpdateProjectState } from "../hooks/useUpdateProjectState";
import { useDeleteProjectState } from "../hooks/useDeleteProjectState";
import CreateProjectStateModal from "../components/CreateProjectStateModal";
import DeleteProjectStateDialog from "../components/DeleteProjectStateDialog";
import { EmptyState } from "@/shared/components/EmptyState";
import ProjectStateTable from "../components/ProjectStateTable";
import { Button } from "@/components/ui/button";
import { useHasScope } from "@/features/auth/hooks/useHasScope";
import { useDebounce } from "@/shared/hooks/useDebounce";
import TableSkeleton from "@/components/ui/TableSkeleton";
import { toast } from "sonner";

export default function ProjectStateListPage(){

    const canWrite = useHasScope("project_states:write");

    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const prevSearch = useRef(searchTerm);
    const prevPage = useRef(page);
    
    const searchChanged = prevSearch.current !== searchTerm;
    const pageChanged = prevPage.current !== page;

    const debouncedSearch = useDebounce(searchTerm, 400);

    const { data, isLoading, isFetching, error } = useProjectStates(page,perPage,debouncedSearch);
    const showSkeleton = isFetching && (searchChanged || pageChanged);

    const { mutateAsync: createProjectState} = useCreateProjectState();
    const { mutateAsync: updateProjectState } = useUpdateProjectState();
    const { mutateAsync: deleteProjectState, isPending: isDeleting } = useDeleteProjectState();

    const [openModal, setOpenModal] = useState(false);
    const [selectedProjectState, setSelectedProjectState] = useState<ProjectState | null>(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedForDelete, setSelectedForDelete] = useState<ProjectState | null>(null);
    

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

    const handleDeleteClick = (projectState: ProjectState) => {
        setSelectedForDelete(projectState);
        setOpenDeleteDialog(true);
    }

    const handleConfirmDelete = async () => {
        if (!selectedForDelete) return;

        try {
            await deleteProjectState(selectedForDelete.id);
            toast.success("Project status deleted successfully");
            setOpenDeleteDialog(false);
            setSelectedForDelete(null);
        } catch (error: any) {
            const status = error?.response?.status;
            const message = error?.response?.data?.message;

            if (status === 409) {
                toast.error(message || "Cannot delete project status because it is related to other records.");
                setOpenDeleteDialog(false);
                return;
            }

            if (status === 404) {
                toast.info("The project status no longer exists.");
                setOpenDeleteDialog(false);
                setSelectedForDelete(null);
                return;
            }

            if (status === 403) {
                toast.error("You do not have permission to delete project statuses.");
                return;
            }

            if (status === 401) {
                return;
            }

            toast.error(message || "Error deleting project status.");
        }
    }

    const handleSearchChange = (value: string) => {
        setSearchTerm(value);
        setPage(1);
    };

    useEffect(() => {
        prevSearch.current = searchTerm;
        prevPage.current = page;
    }, [searchTerm, page]);

    if (isLoading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
            <Loader2 className="loader-default" />
            <p className="text-gray-500">Loading Project Status...</p>
        </div>
    </div>
    );
    
    if (error) {
        return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center space-y-4 max-w-md">
                <span className="text-2xl">⚠️</span>
                <p className="text-red-600 font-medium">Error loading project status</p>
                <p className="text-sm text-gray-600">
                    {error instanceof Error ? error.message : "Unknown error"}
                </p>
            </div>
        </div>
        );
    }

    return(
        <div className="page-container">
            <div className="title-container">
                <div>
                    <h1 className="page-title">Project Status</h1>   
                    <p className="page-description">
                        Manage project statuses
                    </p> 
                </div>
                {canWrite && (<Button className="btn-secondary" size="lg" onClick={handleOpenCreate}>
                    <Plus className="w-5 h-5 mr-2"/>
                    New Project Status
                </Button>)}
                </div>
                
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input type="text" placeholder="Search by status ..." value={searchTerm} onChange={(e) => handleSearchChange(e.target.value)} className="search-default" />
                </div>

            <CreateProjectStateModal open={openModal} projectState={selectedProjectState} onClose={() => setOpenModal(false)} onSubmit={handleSubmit}/>
            {selectedForDelete && (
                <DeleteProjectStateDialog 
                    projectState={selectedForDelete} 
                    open={openDeleteDialog} 
                    onOpenChange={(open) => {
                        setOpenDeleteDialog(open);
                        if (!open) setSelectedForDelete(null);
                    }} 
                    onConfirm={handleConfirmDelete} 
                    isLoading={isDeleting}
                />
            )}

            {showSkeleton ? <TableSkeleton columns={3} />:
            data && data.project_states.length > 0 ? 
                <ProjectStateTable projectStates={data?.project_states} pagination={data?.pagination} page={page} perPage={perPage} setPage={setPage} setPerPage={setPerPage} onEdit={handleEdit} onDelete={handleDeleteClick} canWrite={canWrite}/>
                :
                <EmptyState 
                icon={Tag} title={searchTerm ? "No project statuses found" : "No project statuses available"}
                description={
                    searchTerm ? "Try adjusting your search terms" : "Click 'New Project Status' to create your first project status"
                }/>
            }
        </div>
    )
}
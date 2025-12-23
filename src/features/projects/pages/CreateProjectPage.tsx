import type { Program } from "@/features/programs/types/program.types";

interface Props {
    project?: any; // TODO Replace with project type
    program: Program;
    onClose: () => void,
    onSubmit: (data: any) => void; // TODO Replace with project type
}

export default function CreateProjectPage({ project, program, onClose, onSubmit }: Props){
    <div className="page-container">
        <div className="title-container">
            <div>
                <h1 className="page-title">Project Information</h1>   
                <p className="page-description">
                    {`Use this form to ${project ? 'edit a' : 'create a new'} project in "${program?.name}" program.`}
                </p> 
            </div>
        </div>
    </div>
}
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProgram } from "@/features/programs/api/programQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Percent } from "lucide-react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";
import { Calendar28 } from "../components/DatePicker";
import { Slider } from "@/components/ui/slider";
import { AsyncSearchSelect } from "../components/AsyncSearchSelect/AsyncSearchSelect";
import type { Kpa } from "@/features/kpa/types/KpaType";
import { fetchKpasForSelect } from "@/features/kpa/services/kpa.api";
import type { StrategicOutputCountry } from "@/features/strategic-output/types/StrategicOutput";
import type { Measure } from "@/features/measures/types/measureTypes";
import { fetchStrategicOutputsForSelect } from "@/features/strategic-output/services/strategic-output.api";
import { fetchMeasuresForSelect } from "@/features/measures/services/measure.api";
import { Button } from "@/components/ui/button";
import { fetchIndicatorForSelect } from "@/features/indicator/services/indicator.api";
import { fetchDonorsForSelect } from "@/features/donors/services/donor.api";
import { useEffect, useState } from "react";
import { DonorRow } from "../components/DonorRow";
import { AlertBox } from "../components/AlertBox";
import { AgencyRow } from "../components/AgencyRow";
import { fetchAgenciesForSelector } from "@/features/agency/services/agency.api";
import type { Beneficiary } from "../types/project.types";
import { fetchBeneficiariesForSelector } from "@/features/beneficiaries/service/beneficiaries.api";
import type { FieldErrors } from "react-hook-form";
import { toast } from "sonner";
import { projectSchema } from "../types/project.schema";
import type { ProjectState } from "@/features/project-states/types/projectstate.types";
import { fetchProjectStatesForSelector } from "@/features/project-states/service/projectstate.api";
import { useProject } from "../hooks/useProjects";

type IndicatorFormValue = { id: number; name: string; };
type DonorFormValue = { id: number; name: string; contribution: number };
type AgencyFormValue = { id: number; name: string };

interface Props {
  mode: "create" | "edit";
}

export default function ProjectFormPage({ mode }: Props) {

    const onInvalid = (errors: FieldErrors) => { toast.error("Please fix the highlighted errors before submitting."); console.log(errors)};
    
    const isEditing = mode === "edit";


    const { programId, projectId } = useParams();
    const [totalDonors, setTotalDonors] = useState<number | null>(null);
    const [totalAgencies, setTotalAgencies] = useState<number | null>(null);
    
    const parsedProgramId = Number(programId);
    const parsedProjectId = projectId ? Number(projectId) : undefined;

    if (Number.isNaN(parsedProgramId)) return <div>Invalid program</div>;
    const { data: project, isLoading: isProjectLoading, isError } = useProject(isEditing ? parsedProjectId : undefined);



    const form = useForm<any>({
        resolver: zodResolver(projectSchema),
        defaultValues: { name: "", description: "", kpa: null, strategicOutput: null, measure: null, indicators: [], start_date: null, end_date: null, donors: [], agencies: [], project_url: undefined, budget: 0, contact: { first_name: "", last_name: "", title: "", email: "", phone: "" }, comments: "", program_id: parsedProgramId, project_state_id: 1 }
    });

    const { register, watch, setValue, handleSubmit, reset, formState: { errors } } = form;
    const { data, error, isLoading } = useProgram(parsedProgramId);

    const { fields: indicatorsFields, append: addIndicator, remove: removeIndicator } = useFieldArray<{ indicators: IndicatorFormValue[] },"indicators","fieldId">({ control: form.control,name: "indicators",keyName: "fieldId" });
    const { fields: donorsFields, append: addDonor, remove: removeDonor } = useFieldArray<{donors: DonorFormValue[]},"donors","fieldId">({ control: form.control, name: "donors", keyName: "fieldId"});
    const { fields: agenciesFields, append: addAgency, remove: removeAgency } = useFieldArray<{agencies: AgencyFormValue[]},"agencies","fieldId">({ control: form.control, name: "agencies", keyName: "fieldId"});

    const indicators = watch("indicators");
    const donors = watch("donors");
    const agencies = watch("agencies");

    const hasUnselectedIndicator = indicators?.some((i: IndicatorFormValue) => !i?.id || i.id === 0);
    const hasUnselectedDonor = donors?.some((i: DonorFormValue) => !i?.id || i.id === 0);
    const hasUnselectedAgency = agencies?.some((i: AgencyFormValue) => !i?.id || i.id === 0);


    const fetchDonors = async (params: any) => {
        const response = await fetchDonorsForSelect(donorsFields.map((d) => d.id))(params);
        if (totalDonors === null) setTotalDonors(response.total);
        
        return response;
    }

    const fetchAgencies = async (params: any) => {
        const response = await fetchAgenciesForSelector(agenciesFields.map((d) => d.id))(params);
        if (totalAgencies === null) setTotalAgencies(response.total);
        
        return response;
    }

    const getTotalContributionUsed = () => {
        const donorsTotal = donors.reduce((sum: any, d: any) => sum + (d?.contribution ?? 0), 0);
        const agenciesTotal = agencies.reduce((sum: any, a: any) => sum + (a?.contribution ?? 0),0);
        return donorsTotal + agenciesTotal;
    };

    const getMaxForDonor = (index: number) => {
        const current = donors[index]?.contribution ?? 0;
        const totalUsed = getTotalContributionUsed();

        return Math.max(0, 100 - (totalUsed - current));
    };

    const getMaxForAgency = (index: number) => {
        const current = agencies[index]?.contribution ?? 0;
        const totalUsed = getTotalContributionUsed();

        return Math.max(0, 100 - (totalUsed - current));
    };



    const submit = (data: z.infer<typeof projectSchema>)=> {
        console.log(data)
    }

    useEffect(() => {
    if (isEditing && project) {
        reset({
        name: project.name,
        description: project.description,
        kpa: project.kpa,
        strategicOutput: project.strategic_output,
        measure: project.measure,
        indicators: project.indicators,
        start_date: project.start_date ? new Date(project.start_date) : null,
        end_date: project.end_date ? new Date(project.end_date) : null,
        donors: project.donors,
        agencies: project.agencies,
        project_url: project.project_url,
        budget: project.budget,
        beneficiary: project.beneficiary,
        contact: project.contact,
        progress: project.progress,
        project_state: project.project_state,
        comments: project.comments,
        program_id: project.program_id,
        });
    }
    }, [isEditing, project, reset]);


    return (
    <div className="page-container">
        <div className="title-container">
            <div>
                <h1 className="page-title">{`${mode === "create" ? "Create" : "Edit"} a project for "${data?.name}"`}</h1>
                <p className="page-description">Use this form to {mode === "create" ? "create a new project" : "edit the project details"}.</p>
            </div>
            <div title="Back to Programs">
                <ArrowLeft className="w-6 h-6 text-gray-600 hover:cursor-pointer hover:text-gray-800 transition-colors" onClick={() => window.history.back()} />
            </div>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit(submit, onInvalid)}>
            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">NAME</Label>
                <Input className="input-default" placeholder="Type the project name" {...register("name")} />
                {errors.name && (
                    <p className="text-sm text-red-600">{typeof errors.name.message === 'string' ? errors.name.message : 'Invalid input'}</p>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">DESCRIPTION</Label>
                <Textarea className="input-default" placeholder="Type the project description" {...register("description")} />
                {errors.description && (
                    <p className="text-sm text-red-600">{typeof errors.description.message === 'string' ? errors.description.message : 'Invalid input'}</p>
                )}
            </div>
            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">SELECT A KPA</Label>
                <AsyncSearchSelect<Kpa> value={watch("kpa")} onChange={(v) => { setValue("kpa", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); setValue("strategicOutput", null); setValue("measure", null); setValue("indicators", []); }} fetchOptions={fetchKpasForSelect} getOptionLabel={(k) => k.name ?? ""} getOptionKey={(k)=> k.id} placeholder="Select a KPA" emptyMessage="No KPAs found"/>
                    {errors.kpa && (
                    <p className="text-sm text-red-600">{typeof errors.kpa.message === 'string' ? errors.kpa.message : 'Invalid input'}</p>
                )}
            </div>

            {watch("kpa") && (watch("kpa")!.strategic_outputs_count > 0 ? 
            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">SELECT A STRATEGIC OUTPUT</Label>
                <AsyncSearchSelect<StrategicOutputCountry> value={watch("strategicOutput")} onChange={(v) => { setValue("strategicOutput", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); setValue("measure", null); setValue("indicators", []); }} fetchOptions={fetchStrategicOutputsForSelect(watch("kpa")!.id)} getOptionLabel={(k) => `${k?.name ?? ""} - ${k?.country?.name ?? ""}`} getOptionKey={(k)=> k.id} placeholder="Select a Strategic Output" emptyMessage="No Strategic Outputs found"/>
                {errors.strategicOutput && (
                    <p className="text-sm text-red-600">{typeof errors.strategicOutput.message === 'string' ? errors.strategicOutput.message : 'Invalid input'}</p>
                )}
            </div> :
            <AlertBox message="The KPA does not have Strategic Outputs, select another option"/>)}

            {watch("strategicOutput") && (watch("strategicOutput")!.measures_count > 0 ? 
            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">SELECT A MEASURE</Label>
                <AsyncSearchSelect<Measure> value={watch("measure")} onChange={(v) => { setValue("measure", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); setValue("indicators", []); }} fetchOptions={fetchMeasuresForSelect(watch("strategicOutput")!.id)} getOptionLabel={(k) => k.name ?? ""} getOptionKey={(k)=> k.id} placeholder="Select a Measure" emptyMessage="No Measure found"/>
                {errors.measure && (
                    <p className="text-sm text-red-600">{typeof errors.measure.message === 'string' ? errors.measure.message : 'Invalid input'}</p>
                )}
            </div> : 
            <AlertBox message="The Strategic Output does not have measures, select another option"/> )}

            {watch("measure") && (
                watch("measure")!.indicators_count > 0 ? (
                    <div className="flex flex-col space-y-3">
                        <Label className="text-gray-700">INDICATORS</Label>

                        {indicatorsFields.map((field, index) => (
                            <div key={field.fieldId} className="items-center gap-2">
                            <div className="flex">
                                <AsyncSearchSelect value={watch(`indicators.${index}`)} onChange={(v) => { setValue(`indicators.${index}`, v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); }} fetchOptions={fetchIndicatorForSelect( watch("measure")!.id, indicatorsFields.map(i => Number(i.id)) )} getOptionLabel={(i) => i.name ?? ""} getOptionKey={(i) => i.id} placeholder="Select an indicator" emptyMessage="No indicators found" />
                                <Button type="button" variant="ghost" className="text-red-600 cursor-pointer" onClick={() => removeIndicator(index)} >
                                    Remove
                                </Button>
                            </div>
                            {(errors.indicators as unknown as any[])?.[index]?.id && (
                                <p className="text-sm mt-2 text-red-600">
                                    {Array.isArray(errors.indicators) && typeof errors.indicators[index]?.id?.message === "string" ? errors.indicators[index]?.id?.message : "Invalid input"}
                                </p>
                            )}
                            </div>
                        ))}

                        {errors.indicators && (
                            <p className="text-sm text-red-600">{typeof errors.indicators.message === 'string' ? errors.indicators.message : ''}</p>
                        )}

                        {indicatorsFields.length >= watch("measure")!.indicators_count && (
                            <p className="text-sm text-gray-500">
                                All indicators for this measure have been selected.
                            </p>
                        )}
                        <Button type="button"  className="btn-tertiary w-fit" disabled={ hasUnselectedIndicator || indicatorsFields.length >= watch("measure")!.indicators_count} onClick={() => addIndicator({ id: 0, name: "" })}>
                            + Add indicator
                        </Button>
                    </div>
                ) : (
                    <AlertBox message="The selected measure has no indicators. Please select another one." />
                )
            )}

            <div className="grid sm:grid-cols-2 grid-cols-1 w-full space-y-3 sm:space-y-0 sm:space-x-2">
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">START DATE</Label>
                    <Controller control={form.control} name="start_date" render={({ field }) => ( <Calendar28 value={field.value} onChange={field.onChange} />)} />
                    {errors.start_date && (
                        <p className="text-sm text-red-600">{typeof errors.start_date.message === 'string' ? errors.start_date.message : 'Invalid input'}</p>
                    )}
                </div>
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">END DATE</Label>
                    <Controller control={form.control} name="end_date" render={({ field }) => ( <Calendar28 value={field.value} onChange={field.onChange} />)} />
                    {errors.end_date && (
                        <p className="text-sm text-red-600">{typeof errors.end_date.message === 'string' ? errors.end_date.message : 'Invalid input'}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                <Label className="text-gray-700">SELECT DONOR(S)</Label>
                {donorsFields.map((field, index) => (
                    <div key={index}>
                        <DonorRow key={field.fieldId} index={index} donor={donors[index]} getMaxForDonor={getMaxForDonor} setValue={setValue} removeDonor={removeDonor} fetchDonors={fetchDonors} />
                        {(errors.donors as unknown as any[])?.[index]?.id && (
                            <p className="text-sm mt-2 text-red-600">
                                {Array.isArray(errors.donors) && typeof errors.donors[index]?.id?.message === "string" ? errors.donors[index]?.id?.message : "Invalid input"}
                            </p>
                        )}
                    </div>
                ))}
                {errors.donors && (<p className="text-sm text-red-600"> {typeof errors.donors.message === "string" ? errors.donors.message : ""} </p>)}
                {totalDonors !== null && donorsFields.length >= totalDonors && (
                    <p className="text-sm text-gray-500">
                        All donors have been selected.
                    </p>
                )}
                <Button type="button" className="btn-tertiary w-fit" disabled={ hasUnselectedDonor || (totalDonors !== null && donorsFields.length >= totalDonors) } onClick={() => addDonor({ id: 0, name: "", contribution: 0, }) }>
                    + Add donor
                </Button>
            </div>

            <div className="flex flex-col space-y-3">
                <Label className="text-gray-700">SELECT AGENCY / AGENCIES</Label>
                {agenciesFields.map((field, index) => (
                    <div key={index}>
                        <AgencyRow key={field.fieldId} index={index} agency={agencies[index]} getMaxForContributor={getMaxForAgency} setValue={setValue} removeAgency={removeAgency} fetchAgencies={fetchAgencies}/>
                        {(errors.agencies as unknown as any[])?.[index]?.id && (
                            <p className="text-sm mt-2 text-red-600">
                                {Array.isArray(errors.agencies) && typeof errors.agencies[index]?.id?.message === "string" ? errors.agencies[index]?.id?.message : "Invalid input"}
                            </p>
                        )}
                    </div>
                ))}
                {errors.agencies && (
                    <p className="text-sm text-red-600">{typeof errors.agencies.message === 'string' ? errors.agencies.message : ''}</p>
                )}
                {totalAgencies !== null && agenciesFields.length >= totalAgencies && (
                    <p className="text-sm text-gray-500">
                        All agencies have been selected.
                    </p>
                )}
                <Button type="button"  className="btn-tertiary w-fit" disabled={ hasUnselectedAgency || (totalAgencies !== null && agenciesFields.length >= totalAgencies) } onClick={() => addAgency({ id: 0, name: "" })}>
                    + Add agency
                </Button>
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">PROJECT URL (Optional)</Label>
                <Input  className="input-default" placeholder="Type the project url" {...register("project_url")} />
                {errors.project_url && (
                    <p className="text-sm text-red-600">{typeof errors.project_url.message === 'string' ? errors.project_url.message : 'Invalid input'}</p>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">PROJECT BUDGET</Label>
                <Input type="number" min={0} placeholder="Enter project budget" className="input-default no-spinner" {...register("budget", { valueAsNumber: true })} />
                {errors.budget && (
                    <p className="text-sm text-red-600"> {typeof errors.budget.message === "string" ? errors.budget.message : "Invalid input"} </p>
                )}    
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">SELECT A BENEFICIARY</Label>
                <AsyncSearchSelect<Beneficiary> value={watch("beneficiary")} onChange={(v) => { setValue("beneficiary", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true })}} fetchOptions={fetchBeneficiariesForSelector} getOptionLabel={(k) => k.name ?? ""} getOptionKey={(k: any)=> k.id} placeholder="Select a Beneficiary" emptyMessage="No Beneficiaries found"/>
                {errors.beneficiary && (
                    <p className="text-sm text-red-600">{typeof errors.beneficiary.message === 'string' ? errors.beneficiary.message : 'Invalid input'}</p>
                )}
            </div>

            <div className="flex flex-col space-y-4">
                <Label className="text-gray-700 text-base font-medium">CONTACT INFORMATION</Label>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label>FIRST NAME</Label>
                        <Input {...register("contact.first_name")} placeholder="First name" className="input-default" />
                        {(errors.contact as any)?.first_name && (
                            <p className="text-sm text-red-600">{typeof (errors.contact as any)?.first_name?.message === 'string' ? (errors.contact as any).first_name.message : 'Invalid input'}</p>
                        )} 
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>LAST NAME</Label>
                        <Input {...register("contact.last_name")} placeholder="Last name" className="input-default" />
                        {(errors.contact as any)?.last_name && (
                            <p className="text-sm text-red-600">{typeof (errors.contact as any)?.last_name?.message === 'string' ? (errors.contact as any).last_name.message : 'Invalid input'}</p>
                        )} 
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label>TITLE</Label>
                    <Input {...register("contact.title")} placeholder="e.g. Project Manager" className="input-default" />
                    {(errors.contact as any)?.title && (
                        <p className="text-sm text-red-600">{typeof (errors.contact as any)?.title?.message === 'string' ? (errors.contact as any).title.message : 'Invalid input'}</p>
                    )} 
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2">
                        <Label>EMAIL</Label>
                        <Input type="email" {...register("contact.email")} placeholder="email@example.org" className="input-default"/>
                        {(errors.contact as any)?.email && (
                            <p className="text-sm text-red-600">{typeof (errors.contact as any)?.email?.message === 'string' ? (errors.contact as any).email.message : 'Invalid input'}</p>
                        )} 
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>PHONE</Label>
                        <Input {...register("contact.phone")} placeholder="+59171234567" className="input-default"/>
                        {(errors.contact as any)?.phone && (
                            <p className="text-sm text-red-600">{typeof (errors.contact as any)?.phone?.message === 'string' ? (errors.contact as any).phone.message : 'Invalid input'}</p>
                        )} 
                    </div>
                </div>
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">PROGRESS</Label>
                <Controller control={form.control} name="progress" defaultValue={50}
                    render={({ field }) => (
                        <div className="flex items-center gap-4">
                            <Slider value={[field.value]} max={100} step={1} onValueChange={(value) => field.onChange(value[0])} className="flex-1" />
                            <div className="relative w-[90px]">
                                <Input type="number" min={0} max={100} value={field.value} onChange={(e) => { const val = Number(e.target.value); if (!Number.isNaN(val)) { field.onChange(Math.min(100, Math.max(0, val))); } }} className="pr-7 text-center input-default no-spinner" />
                                <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                            </div>
                        </div>
                    )}
                />
                {errors.progress && (
                    <p className="text-sm text-red-600"> {typeof errors.progress.message === "string" ? errors.progress.message : "Invalid input"} </p>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">SELECT THE PROJECT STATE</Label>
                <AsyncSearchSelect<ProjectState> value={watch("project_state")} onChange={(v) => { setValue("project_state", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true })}} fetchOptions={fetchProjectStatesForSelector} getOptionLabel={(k) => k.state ?? ""} getOptionKey={(k: any)=> k.id} placeholder="Select the project state" emptyMessage="No project state found"/>
                {errors.project_state && (
                    <p className="text-sm text-red-600">{typeof errors.project_state.message === 'string' ? errors.project_state.message : 'Invalid input'}</p>
                )}
            </div>

            <div className="flex flex-col space-y-2">
                <Label className="text-gray-700">COMMENTS (Optional)</Label>
                <Textarea  className="input-default" placeholder="Project comments" {...register("comments")} />
                {errors.comments && (
                    <p className="text-sm text-red-600">{typeof errors.comments.message === 'string' ? errors.comments.message : 'Invalid input'}</p>
                )}
            </div>

            <Button type="submit" className="btn-secondary">{isEditing ? 'Edit' : 'Create'}</Button>
        </form>
    </div>
  );
}


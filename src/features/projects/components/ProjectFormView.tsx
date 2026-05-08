import {  Percent } from "lucide-react";
import type { UseProjectFormReturn } from "../hooks/useProjectForm";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AsyncSearchSelect } from "@/shared/components/AsyncSearchSelect/AsyncSearchSelect";
import type {  KpaProject } from "@/features/kpa/types/KpaType";
import { fetchKpasForSelect } from "@/features/kpa/services/kpa.api";
import type { StrategicOutputCountry } from "@/features/strategic-output/types/StrategicOutput";
import { fetchStrategicOutputsForSelect } from "@/features/strategic-output/services/strategic-output.api";
import { AlertBox } from "./AlertBox";
import type { Measure } from "@/features/measures/types/measureTypes";
import { fetchMeasuresForSelect } from "@/features/measures/services/measure.api";
import { Controller, useWatch } from "react-hook-form";
import { Calendar28 } from "./DatePicker";
import { Button } from "@/components/ui/button";
import { IndicatorSection } from "./IndicatorSection";
import type { Beneficiary } from "../types/project.types";
import { fetchBeneficiariesForSelector } from "@/features/beneficiaries/service/beneficiaries.api";
import { Slider } from "@/components/ui/slider";
import type { ProjectState } from "@/features/project-states/types/projectstate.types";
import { fetchProjectStatesForSelector } from "@/features/project-states/service/projectstate.api";
import { DonorSection } from "./DonorSection";
import { AgencySection } from "./AgencySection";
import { fetchDonorsForSelect } from "@/features/donors/services/donor.api";
import { fetchAgenciesForSelector } from "@/features/agency/services/agency.api";
import { useCallback, useEffect, useState } from "react";
import BackArrow from "@/shared/components/backArrow/BackArrow";
import {
    fetchProgramKpasForSelect,
    fetchProgramMeasuresForSelect,
    fetchProgramStrategicOutputsForSelect,
} from "../services/project.catalog.api";
import { useAuthStore } from "@/features/auth/store/authStore";

interface Props {
    mode: "create" | "edit";
    programName?: string;
    programId?: number;
    projectId?: number;
    form: UseProjectFormReturn;
    onSubmit: (data: any) => void;
    onInvalid: (errors: any) => void;
}

function ProgressPercentInput({
    value,
    max,
    onCommit,
}: {
    value: number | undefined;
    max: number;
    onCommit: (nextValue: number) => void;
}) {
    const [inputValue, setInputValue] = useState(value === 0 || value == null ? "0" : String(value));
    const [isFocused, setIsFocused] = useState(false);

    const commitValue = (rawValue: string) => {
        const normalizedValue = rawValue.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

        if (normalizedValue === "") {
            setInputValue("0");
            onCommit(0);
            return;
        }

        const clamped = Math.min(Number(normalizedValue), max);
        setInputValue(String(clamped));
        onCommit(clamped);
    };

    const displayValue = isFocused ? inputValue : value === 0 || value == null ? "0" : String(value);

    return (
        <div className="relative w-[90px]">
            <Input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                min={0}
                max={max}
                value={displayValue}
                onFocus={(e) => {
                    setIsFocused(true);
                    if (e.currentTarget.value === "0") {
                        e.currentTarget.select();
                        setInputValue("");
                    }
                }}
                onChange={(e) => {
                    const nextValue = e.target.value.replace(/\D/g, "").replace(/^0+(?=\d)/, "");
                    setInputValue(nextValue);
                    onCommit(nextValue === "" ? 0 : Math.min(Number(nextValue), max));
                }}
                onBlur={() => commitValue(inputValue)}
                onBlurCapture={() => setIsFocused(false)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        commitValue(inputValue);
                    }
                }}
                placeholder="0"
                className="pr-7 text-center input-default no-spinner"
            />
            <Percent className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
        </div>
    );
}
 
export default function ProjectFormView({ mode, programName, form, onSubmit, onInvalid, programId }: Props) {
    const isAdmin = useAuthStore((state) => state.hasScope("*:*"));
    const canEditWeight = useAuthStore((state) => state.hasScope("projects:weight"));
    const canViewByCountry = useAuthStore((state) => state.hasScope("projects:view_by_country"));
    const isCountryManager = canViewByCountry && !isAdmin;
    const canShowWeight = mode === "edit" && canEditWeight && isCountryManager;
    const useProgramContext = Boolean(programId);


    const [totalDonors, setTotalDonors] = useState<number | null>(null);
    const [totalAgencies, setTotalAgencies] = useState<number | null>(null);

    const kpa = useWatch({ control: form.form.control, name: "kpa" });
    const strategicOutput = useWatch({ control: form.form.control, name: "strategicOutput" });
    const measure = useWatch({ control: form.form.control, name: "measure" });
    const project_state = useWatch({ control: form.form.control, name: "project_state" });
    const beneficiary = useWatch({ control: form.form.control, name: "beneficiary" });

    const fetchKpas = useCallback(
        useProgramContext ? fetchProgramKpasForSelect(programId ?? 0) : fetchKpasForSelect,
        [useProgramContext, programId]
    );

    const fetchStrategicOutputs = useCallback(
        useProgramContext
            ? fetchProgramStrategicOutputsForSelect(programId ?? 0, kpa?.id ?? 0)
            : fetchStrategicOutputsForSelect(kpa?.id ?? 0),
        [useProgramContext, programId, kpa?.id]
    );

    const fetchMeasures = useCallback(
        useProgramContext
            ? fetchProgramMeasuresForSelect(programId ?? 0, strategicOutput?.id ?? 0)
            : fetchMeasuresForSelect(strategicOutput?.id ?? 0),
        [useProgramContext, programId, strategicOutput?.id]
    );

    const formatNumberedLabel = (numbering: string | undefined, label: string) =>
        numbering ? `${numbering} ${label}`.trim() : label;

    useEffect(() => {
        fetchDonorsForSelect([])({ query: "", page: 1, limit: 1 })
        .then(res => {setTotalDonors(res.total)});
    }, []);

    useEffect(() => {
        fetchAgenciesForSelector([])({ query: "",page: 1,limit: 1 })
        .then(res => {setTotalAgencies(res.total)});
    }, []);


    const fetchDonors = useCallback(
        fetchDonorsForSelect(form.excludedDonorIds),
        [form.excludedDonorIds]
    );
    
    const fetchAgencies = useCallback(
        fetchAgenciesForSelector(form.excludedAgencyIds),
        [form.excludedAgencyIds]
    );

    return (
        <div className="page-container">
            <div className="title-container">
                <div>       
                    <h1 className="page-title">{`${(mode as string) === "create" ? "Create" : "Edit"} a project for "${programName ?? ""}"`}</h1>
                    <p className="page-description">Use this form to {(mode as string) === "create" ? "create a new project" : "edit the project details"}.</p>
                </div>
                <BackArrow backTo="/app/projects" /> 
            </div>
            <form className="space-y-6" onSubmit={form.form.handleSubmit(onSubmit, onInvalid)}>
                {isCountryManager && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                        Your role only allows editing the project weight. All other fields are read-only.
                    </div>
                )}
                {canShowWeight && (
                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-700">PROJECT WEIGHT (0 TO 1)</Label>
                        <Input
                            type="number"
                            min={0}
                            max={1}
                            step="0.0001"
                            placeholder="Enter project weight"
                            className="input-default no-spinner"
                            {...form.form.register("weight", { valueAsNumber: true })}
                        />
                        {form.form.formState.errors.weight && (
                            <p className="text-sm text-red-600"> {typeof form.form.formState.errors.weight.message === "string" ? form.form.formState.errors.weight.message : "Invalid input"} </p>
                        )}
                    </div>
                )}
                <div className={`space-y-6${isCountryManager ? " pointer-events-none opacity-60 select-none" : ""}`}>
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">NAME</Label>
                    <Input className="input-default" placeholder="Type the project name" {...form.form.register("name")} />
                    {form.form.formState.errors.name && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.name.message === 'string' ? form.form.formState.errors.name.message : 'Invalid input'}</p>
                    )}
                </div>
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">DESCRIPTION</Label>
                    <Textarea className="input-default" placeholder="Type the project description" {...form.form.register("description")} />
                    {form.form.formState.errors.description && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.description.message === 'string' ? form.form.formState.errors.description.message : 'Invalid input'}</p>
                    )}
                </div>
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">SELECT A KPA</Label>
                    <AsyncSearchSelect<KpaProject> enab={false} value={kpa} onChange={(v) => { form.form.setValue("kpa", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); form.form.setValue("strategicOutput", null); form.form.setValue("measure", null); form.form.setValue("indicators", []); }} fetchOptions={fetchKpas} getOptionLabel={(k) => formatNumberedLabel(k.numbering, k.name ?? "")} getOptionKey={(k)=> k.id} placeholder="Select a KPA" emptyMessage="No KPAs found"/>
                        {form.form.formState.errors.kpa && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.kpa.message === 'string' ? form.form.formState.errors.kpa.message : 'Invalid input'}</p>
                    )}
                </div> 

                {kpa && kpa !==null && kpa.strategic_outputs_count > 0 ? 
                (<div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">SELECT A STRATEGIC OUTPUT</Label>
                    <AsyncSearchSelect<StrategicOutputCountry> enab={false} value={strategicOutput} onChange={(v) => { form.form.setValue("strategicOutput", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); form.form.setValue("measure", null); form.form.setValue("indicators", []); }} fetchOptions={fetchStrategicOutputs} getOptionLabel={(k) => formatNumberedLabel(k?.numbering, `${k?.name ?? ""} - ${k?.country?.name ?? ""}`)} getOptionKey={(k)=> k.id} placeholder="Select a Strategic Output" emptyMessage="No Strategic Outputs found"/>
                    {form.form.formState.errors.strategicOutput && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.strategicOutput.message === 'string' ? form.form.formState.errors.strategicOutput.message : 'Invalid input'}</p>
                    )}
                </div>) :
                (kpa !== null && <AlertBox message="The KPA does not have Strategic Outputs, select another option"/>)
                }

                {strategicOutput && (strategicOutput.measures_count > 0 ? 
                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">SELECT A MEASURE</Label>
                    <AsyncSearchSelect<Measure> enab={false} value={measure} onChange={(v) => { form.form.setValue("measure", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true }); form.form.setValue("indicators", []); }} fetchOptions={fetchMeasures} getOptionLabel={(k) => formatNumberedLabel(k.numbering, k.name ?? "")} getOptionKey={(k)=> k.id} placeholder="Select a Measure" emptyMessage="No Measure found"/>
                    {form.form.formState.errors.measure && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.measure.message === 'string' ? form.form.formState.errors.measure.message : 'Invalid input'}</p>
                    )}
                </div> : 
                <AlertBox message="The Strategic Output does not have measures, select another option"/> )}

                {measure && (
                    measure.indicators_count > 0 ? (
                        <IndicatorSection form={form} measure={measure} useProgramContext={useProgramContext} />
                    ) : (
                        <AlertBox message="The selected measure has no indicators. Please select another one." />
                    )
                )}

                <div className="grid sm:grid-cols-2 grid-cols-1 w-full space-y-3 sm:space-y-0 sm:space-x-2">
                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-700">START DATE</Label>
                        <Controller control={form.form.control} name="start_date" render={({ field }) => ( <Calendar28 value={field.value ?? null} onChange={field.onChange} />)} />
                        {form.form.formState.errors.start_date && (
                            <p className="text-sm text-red-600">{typeof form.form.formState.errors.start_date.message === 'string' ? form.form.formState.errors.start_date.message : 'Invalid input'}</p>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-700">END DATE</Label>
                        <Controller control={form.form.control} name="end_date" render={({ field }) => ( <Calendar28 value={field.value ?? null} onChange={field.onChange} />)} />
                        {form.form.formState.errors.end_date && (
                            <p className="text-sm text-red-600">{typeof form.form.formState.errors.end_date.message === 'string' ? form.form.formState.errors.end_date.message : 'Invalid input'}</p>
                        )}
                    </div>
                </div> 

                <DonorSection form={form} totalDonors={totalDonors} fetchDonors={fetchDonors} />

                <AgencySection form={form} totalAgencies={totalAgencies} fetchAgencies={fetchAgencies} />

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">PROJECT URL (Optional)</Label>
                    <Input  className="input-default" placeholder="Type the project url" {...form.form.register("project_url")} />
                    {form.form.formState.errors.project_url && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.project_url.message === 'string' ? form.form.formState.errors.project_url.message : 'Invalid input'}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">PROJECT BUDGET</Label>
                    <Input type="number" min={0} placeholder="Enter project budget" className="input-default no-spinner" {...form.form.register("budget", { valueAsNumber: true })} />
                    {form.form.formState.errors.budget && (
                        <p className="text-sm text-red-600"> {typeof form.form.formState.errors.budget.message === "string" ? form.form.formState.errors.budget.message : "Invalid input"} </p>
                    )}    
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">SELECT A BENEFICIARY</Label>
                    <AsyncSearchSelect<Beneficiary>  enab={false}  value={beneficiary} onChange={(v) => { form.form.setValue("beneficiary", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true })}} fetchOptions={fetchBeneficiariesForSelector} getOptionLabel={(k) => k.name ?? ""} getOptionKey={(k: any)=> k.id} placeholder="Select a Beneficiary" emptyMessage="No Beneficiaries found"/>
                    {form.form.formState.errors.beneficiary && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.beneficiary.message === 'string' ? form.form.formState.errors.beneficiary.message : 'Invalid input'}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-4">
                    <Label className="text-gray-700 text-base font-medium">CONTACT INFORMATION</Label>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label>FIRST NAME</Label>
                            <Input {...form.form.register("contact.first_name")} placeholder="First name" className="input-default" />
                            {(form.form.formState.errors.contact as any)?.first_name && (
                                <p className="text-sm text-red-600">{typeof (form.form.formState.errors.contact as any)?.first_name?.message === 'string' ? (form.form.formState.errors.contact as any).first_name.message : 'Invalid input'}</p>
                            )} 
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>LAST NAME</Label>
                            <Input {...form.form.register("contact.last_name")} placeholder="Last name" className="input-default" />
                            {(form.form.formState.errors.contact as any)?.last_name && (
                                <p className="text-sm text-red-600">{typeof (form.form.formState.errors.contact as any)?.last_name?.message === 'string' ? (form.form.formState.errors.contact as any).last_name.message : 'Invalid input'}</p>
                            )} 
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label>TITLE</Label>
                        <Input {...form.form.register("contact.title")} placeholder="e.g. Project Manager" className="input-default" />
                        {(form.form.formState.errors.contact as any)?.title && (
                            <p className="text-sm text-red-600">{typeof (form.form.formState.errors.contact as any)?.title?.message === 'string' ? (form.form.formState.errors.contact as any).title.message : 'Invalid input'}</p>
                        )} 
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex flex-col space-y-2">
                            <Label>EMAIL</Label>
                            <Input type="email" {...form.form.register("contact.email")} placeholder="email@example.org" className="input-default"/>
                            {(form.form.formState.errors.contact as any)?.email && (
                                <p className="text-sm text-red-600">{typeof (form.form.formState.errors.contact as any)?.email?.message === 'string' ? (form.form.formState.errors.contact as any).email.message : 'Invalid input'}</p>
                            )} 
                        </div>

                        <div className="flex flex-col space-y-2">
                            <Label>PHONE</Label>
                            <Input {...form.form.register("contact.phone")} placeholder="+59171234567" className="input-default"/>
                            {(form.form.formState.errors.contact as any)?.phone && (
                                <p className="text-sm text-red-600">{typeof (form.form.formState.errors.contact as any)?.phone?.message === 'string' ? (form.form.formState.errors.contact as any).phone.message : 'Invalid input'}</p>
                            )} 
                        </div>
                    </div>
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">PROGRESS</Label>
                    <Controller control={form.form.control} name="progress"
                        render={({ field }) => (
                            <div className="flex items-center gap-4">
                                <Slider value={[field.value ?? 0]} max={100} step={1} onValueChange={(value) => field.onChange(value[0])} className="flex-1" />
                                <ProgressPercentInput
                                    value={field.value}
                                    max={100}
                                    onCommit={field.onChange}
                                />
                            </div>
                        )}
                    />
                    {form.form.formState.errors.progress && (
                      <p className="text-sm text-red-600"> {typeof form.form.formState.errors.progress.message === "string" ? form.form.formState.errors.progress.message : "Invalid input"} </p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">SELECT THE PROJECT STATE</Label>
                    <AsyncSearchSelect<ProjectState>  enab={false} value={project_state} onChange={(v) => { form.form.setValue("project_state", v, { shouldValidate: true, shouldDirty: true, shouldTouch:true })}} fetchOptions={fetchProjectStatesForSelector} getOptionLabel={(k) => k.state ?? ""} getOptionKey={(k: any)=> k.id} placeholder="Select the project state" emptyMessage="No project state found"/>
                    {form.form.formState.errors.project_state && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.project_state.message === 'string' ? form.form.formState.errors.project_state.message : 'Invalid input'}</p>
                    )}
                </div>

                <div className="flex flex-col space-y-2">
                    <Label className="text-gray-700">COMMENTS (Optional)</Label>
                    <Textarea  className="input-default" placeholder="Project comments" {...form.form.register("comments")} />
                    {form.form.formState.errors.comments && (
                        <p className="text-sm text-red-600">{typeof form.form.formState.errors.comments.message === 'string' ? form.form.formState.errors.comments.message : 'Invalid input'}</p>
                    )}
                </div>
                </div>
                                <Button type="submit" className="btn-secondary">{mode === "edit" ? 'Update Project' : 'Create'}</Button>
            </form>
        </div>
  );
}
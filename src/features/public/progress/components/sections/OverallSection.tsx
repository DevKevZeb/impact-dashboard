import useOverall from "../../hooks/useOverall";
import { HorizontalBarChart } from "../charts/HorizontalBarChart";
import SimpleBarChart from "../charts/SimpleBarChart";
import { StackBarChart } from "../charts/StackBarChart";

interface OverallSectionProps {
    countryId?: number;
}

export default function OverallSection({ countryId }: OverallSectionProps){

    const { data, isLoading, error } = useOverall(countryId);
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex justify-center mb-10 sm:mb-16">
                <h1 className="mb-4 second-head-label font-light text-center">Overall Strategy</h1>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="third-head-label">Degree of Implementation</h1>
                    <h3 className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">{`The degree of implementation is represented as a percentage, indicating the extent of accomplishment of the Pacific Regional E-commerce Strategy and Roadmap by averaging out the progress on implementation of all the ${data?.name}.`}</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6 sm:gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <HorizontalBarChart name={data.name} implementation={data.implementation}/>}
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="third-head-label">Resource Allocated</h1>
                    <h3 className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">{`"Resources allocated" consolidates all the budgets designated for the projects implementing the ${data?.name} of the Pacific Regional E-commerce Strategy and Roadmap. The figure is expressed in USD.`}</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6 sm:gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <span className="bg-primary w-full text-2xl sm:text-3xl lg:text-4xl flex flex-col sm:flex-row gap-2 items-center justify-center sm:justify-start px-3 sm:px-4 py-3 rounded-lg text-center sm:text-left">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8 sm:size-10 lg:size-12 shrink-0">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
                        </svg>
                        <span className="wrap-break-word">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(data.resource)}</span>
                    </span>}
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="third-head-label">Beneficiaries</h1>
                    <h3 className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">The visual representations below indicate which Forum Island Countries have benefitted from at least one project implementing a Measure of the Pacific Regional E-commerce Strategy and Roadmap, split by Key Priority Areas (KPA).</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6 sm:gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <StackBarChart data={data.beneficiaries}/>}
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="third-head-label">Implementing agencies’ contribution to implementation</h1>
                    <h3 className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">This statistic quantifies, in percentage terms, the contribution made by each agency that implements at least one project under a Measure of the Pacific Regional E-commerce Strategy and Roadmap.</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6 sm:gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <SimpleBarChart data={data?.agencies}/>}
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <h1 className="third-head-label">Donor partners’ contribution to implementation</h1>
                    <h3 className="mt-4 sm:mt-6 text-sm sm:text-base leading-relaxed">This statistic quantifies, in percentage terms, the contribution made by each donor partner to the implementation of the KPAs of the Pacific Regional E-commerce Strategy and Roadmap.</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center gap-6 sm:gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <SimpleBarChart data={data?.donors}/>}
                </div>
            </div>
        </div>
    )
}
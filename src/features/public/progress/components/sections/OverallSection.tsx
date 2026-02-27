import useOverall from "../../hooks/useOverall";
import { HorizontalBarChart } from "../charts/HorizontalBarChart";


export default function OverallSection(){

    const { data, isLoading, error } = useOverall();
    return(
        <div className="w-full flex flex-col justify-center items-center">
             <div className="w-5/7 flex justify-center mb-20">
                <h1 className="mb-4 second-head-label font-light">Overall Strategy</h1>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-5/7">
                    <h1 className="third-head-label">Degree of Implementation</h1>
                    <h3 className="mt-6">{`The degree of implementation is represented as a percentage, indicating the extent of accomplishment of the Pacific Regional E-commerce Strategy and Roadmap by averaging out the progress on implementation of all the ${data?.name}.`}</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-5/7 md:w-3/7 flex flex-col justify-center items-center gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <HorizontalBarChart name={data.name} implementation={data.implementation}/>}
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-5/7">
                    <h1 className="third-head-label">Resource Allocated</h1>
                    <h3 className="mt-6">{`"Resources allocated" consolidates all the budgets designated for the projects implementing the ${data?.name} of the Pacific Regional E-commerce Strategy and Roadmap. The figure is expressed in USD.`}</h3>
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-5/7">
                    <h1 className="third-head-label">Beneficiaries</h1>
                    <h3 className="mt-6">The visual representations below indicate which Forum Island Countries have benefitted from at least one project implementing a Measure of the Pacific Regional E-commerce Strategy and Roadmap, split by Key Priority Areas (KPA).</h3>
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-5/7">
                    <h1 className="third-head-label">Implementing agencies’ contribution to implementation</h1>
                    <h3 className="mt-6">This statistic quantifies, in percentage terms, the contribution made by each agency that implements at least one project under a Measure of the Pacific Regional E-commerce Strategy and Roadmap.</h3>
                </div>
            </div>

            <div className="w-full flex justify-center py-7">
                <div className="w-5/7">
                    <h1 className="third-head-label">Donor partners’ contribution to implementation</h1>
                    <h3 className="mt-6">This statistic quantifies, in percentage terms, the contribution made by each donor partner to the implementation of the KPAs of the Pacific Regional E-commerce Strategy and Roadmap.</h3>
                </div>
            </div>
        </div>
    )
}
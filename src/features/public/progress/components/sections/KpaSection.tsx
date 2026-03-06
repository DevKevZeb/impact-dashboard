import useAllKpasImplementation from "../../hooks/useAllKpas"
import { mapKpasResourcePercent } from "../../mappers/kpa.data.mapper";
import HorizontalMultiBarChart from "../charts/HorizontalMultiBarChart";
import { StackBarChart } from "../charts/StackBarChart";

const formatMillions = (value: number) => {
  return `$${(value / 1_000_000).toFixed(2)} million dollars`;
};

export default function KpaSection(){

    const {data, isLoading, error} = useAllKpasImplementation();
    return(
        <div className="w-full flex flex-col justify-center items-center">
            <div className="w-5/7 flex justify-center mb-20">
                <h1 className="mb-4 second-head-label font-light">All Key Priority Areas</h1>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-5/7">
                    <h1 className="third-head-label">Degree of Implementation</h1>
                    <h3 className="mt-6">The degree of implementation is represented as a percentage, indicating the extent of accomplishment for each Key Priority Area (KPA) by averaging out the progress on implementation of the Measures linked to it.</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <HorizontalMultiBarChart data={data.kpas} />}
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-5/7">
                    <h1 className="third-head-label">Resources allocated</h1>
                    <h3 className="mt-6">"Resources allocated" consolidates all the budgets designated for the projects implementing the Measures linked to each Key Priority Area (KPA).</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <HorizontalMultiBarChart data={mapKpasResourcePercent(data.kpas, data.resource)} label={`Budget Allocation: ${formatMillions(data.resource)}.`}/>}
                </div>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-5/7">
                    <h1 className="third-head-label">Beneficiaries</h1>
                    <h3 className="mt-6">The visual representations below indicate which Forum Island Countries have benefitted from at least one project implementing a Measure of the Pacific Regional E-commerce Strategy and Roadmap, split by Key Priority Areas (KPA):</h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <StackBarChart data={data.kpas}/>}
                </div>
            </div>
            {/*<div className="w-full flex justify-center">
                <div className="w-5/7">
                    <h1 className="third-head-label">Implementing agencies’ contribution to implementation</h1>
                    <h3 className="mt-6">This statistic quantifies, in percentage terms, the contribution made by each agency that implements at least one project under a Measure for each of the Key Priority Areas (KPA).    </h3>
                </div>
            </div>
            <div className="w-full flex flex-col items-center py-7 justify-center">
                <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
                    {isLoading && <p>Loading...</p>}
                    {error && <p>Error loading data</p>}
                    {data && <StackBarChart data={data.kpas}/>}
                </div>
            </div>*/}
        </div>
    )
} 
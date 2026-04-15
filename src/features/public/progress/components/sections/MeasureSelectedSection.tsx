import useMeasureSelected from "../../hooks/useMeasureSelected";
import { HorizontalBarChart } from "../charts/HorizontalBarChart";
import countriesSvg from "@/assets/countries.svg";

type Props = { measureId: number; measureName: string; };

export default function MeasureSelectedSection({ measureId, measureName }: Props) {
	const { data, isLoading, error } = useMeasureSelected(measureId);

	return (
		<div className="w-full flex flex-col justify-center items-center">
			<div className="w-5/7 flex justify-center mb-20">
				<h1 className="mb-4 second-head-label font-light">Measure: {measureName}</h1>
			</div>

			<div className="w-full flex justify-center">
				<div className="w-5/7">
					<h1 className="third-head-label">Degree of Implementation</h1>
                    <h3 className="mt-6">{`The degree of implementation is represented as a percentage, indicating the extent of progress made towards the delivery of Measure: ${measureName} based on the completion of its related activities.`}</h3>
				</div>
			</div>
			<div className="w-full flex flex-col items-center py-7 justify-center">
				<div className="w-5/7 md:w-3/7 flex flex-col justify-center items-center gap-10">
					{isLoading && <p>Loading...</p>}
					{error && <p>Error loading data</p>}
					{data && <HorizontalBarChart name={data.name} implementation={data.implementation} />}
				</div>
			</div>

			<div className="w-full flex justify-center py-7">
				<div className="w-5/7">
					<h1 className="third-head-label">Resource Allocated</h1>
                    <h3 className="mt-6">{`"Resources allocated" consolidates all the budgets designated for the projects implementing the activities linked to Measure: ${measureName}.`}</h3>
				</div>
			</div>
			<div className="w-full flex flex-col items-center py-7 justify-center">
				<div className="w-5/7 md:w-3/7 flex flex-col justify-center items-center gap-10">
					{isLoading && <p>Loading...</p>}
					{error && <p>Error loading data</p>}
					{data && (
						<span className="bg-primary w-full text-5xl flex space-x-2 items-center px-2 py-3 rounded-lg">
							<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-14">
								<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
							</svg>
						<span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(data.resource)}</span>
						</span>
					)}
				</div>
			</div>
			<div className="w-full flex justify-center py-7">
				<div className="w-5/7">
					<h1 className="third-head-label">Beneficiaries</h1>
                    <h3 className="mt-6">{`The visual representations below indicate the Forum Island Countries that have benefited from at least one project implementing Measure: ${measureName}.`}</h3>
				</div>
			</div>
			<div className="w-full mt-10 px-4 sm:px-6 lg:px-8 flex justify-center">
				<img
					src={countriesSvg}
					alt="Overall Strategy"
					className="w-full h-auto max-w-6xl object-contain"
				/>
			</div>
		</div>
	);
}

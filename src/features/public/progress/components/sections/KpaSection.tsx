import useAllKpasImplementation from "../../hooks/useAllKpas"
import { mapKpasResourcePercent } from "../../mappers/kpa.data.mapper";
import { aggregateContributorsByKpa } from "../../mappers/contribution.data.mapper";
import HorizontalMultiBarChart from "../charts/HorizontalMultiBarChart";

const formatMillions = (value: number) => {
  return `$${(value / 1_000_000).toFixed(2)} million dollars`;
};

interface KpaSectionProps {
  countryId?: number;
}

export default function KpaSection({ countryId }: KpaSectionProps){
  const { data, isLoading, error } = useAllKpasImplementation(countryId);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-5/7 flex justify-center mb-20">
        <h1 className="mb-4 second-head-label font-light">All Key Priority Areas</h1>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-5/7">
          <h1 className="third-head-label">Degree of Implementation</h1>
          <h3 className="mt-6">
            The degree of implementation is represented as a percentage, indicating the extent
            of accomplishment for each Key Priority Area (KPA) by averaging out the progress on
            implementation of the Measures linked to it.
          </h3>
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
          <h3 className="mt-6">
            This graph presents the total funding allocated to projects implementing the measures, aggregated by Key Priority Area (KPA).
          </h3>
        </div>
      </div>
      <div className="w-full flex flex-col items-center py-7 justify-center">
        <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading data</p>}
          {data && (
            <HorizontalMultiBarChart
              data={mapKpasResourcePercent(data.kpas, data.resource)}
              label={`Budget Allocation: ${formatMillions(data.resource)}.`}
            />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-5/7">
          <h1 className="third-head-label">Implementing agencies’ contribution to implementation</h1>
          <h3 className="mt-6">
            This statistic shows the percentage contribution of each agency to each Key Priority Area (KPA).
          </h3>
        </div>
      </div>
      <div className="w-full flex flex-col items-center py-7 justify-center">
        <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading data</p>}
          {data && (
            <HorizontalMultiBarChart
              data={aggregateContributorsByKpa(data.kpas, "agencies")}
              label="Contribution percent"
              emptyMessage="No implementing agencies have been reported yet."
            />
          )}
        </div>
      </div>
      <div className="w-full flex justify-center">
        <div className="w-5/7">
          <h1 className="third-head-label">Share of budget provided by donor</h1>
          <h3 className="mt-6">
            This statistic shows, in percentage terms, the contribution made by donor partners to the implementation of each Key Priority Area (KPA).
          </h3>
        </div>
      </div>
      <div className="w-full flex flex-col items-center py-7 justify-center">
        <div className="w-5/7 lg:w-3/7 flex flex-col justify-center items-center gap-10">
          {isLoading && <p>Loading...</p>}
          {error && <p>Error loading data</p>}
          {data && (
            <HorizontalMultiBarChart
              data={aggregateContributorsByKpa(data.kpas, "donors")}
              label="Contribution percent"
              emptyMessage="No donors have been reported yet."
            />
          )}
        </div>
      </div>
    </div>
  );
}

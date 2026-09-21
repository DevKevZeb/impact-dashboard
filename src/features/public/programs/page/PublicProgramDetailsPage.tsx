import { CalendarDays, CircleUserRound, HandCoins, Handshake, Leaf, LifeBuoy, Loader, MapPin, Smile, ToggleLeft } from "lucide-react";
import { useParams } from "react-router-dom";
import ProjectBanner from "../../components/ProjectBanner";
import InfoBlock from "../../components/InfoBlock";
import { usePublicProgram } from "../hooks/usePrograms";
import InfoRow from "../../components/InfoRow";
import PublicProjectsExplorer from "../../projects/components/PublicProjectsExplorer";

function formatDateEN(date: Date | string): string {
  if (!date) {
    return "N/A";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "N/A";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PublicProgramDetailsPage() {
  const { id } = useParams();
  const parsedId = Number(id);
  const { data, isLoading, error } = usePublicProgram(parsedId);

  if (Number.isNaN(parsedId)) {
    return <div className="p-8 text-red-600">Invalid program</div>;
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[91vh] flex-col justify-center py-20 text-slate-500">
        <Loader className="loader-default" />
        <p className="text-center">Loading program information...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center py-20 text-red-600">
        Failed to load program information
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProjectBanner
        title={data.name}
        image={"https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450-dark.png"}
      />

      <div className="mx-auto w-full flex flex-col justify-center items-center py-0">
        <section className="w-4/7 py-5 mb-10">
          <h2 className="section-title my-10">About the Program</h2>
          <p className="mt-4 text-slate-700 text-justify max-w-4xl">{data.description}</p>
        </section>

        <div className="w-full flex justify-center bg-slate-200">
          <section className="w-5/7 px-6 border-t-8 border-cyan-500 pt-20 grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-0 md:divide-x md:divide-slate-300">
            <div className="space-y-8">
              <InfoBlock label="Start and End Date" icon={CalendarDays}>
                {formatDateEN(data.program_summary.start_date)} - {formatDateEN(data.program_summary.end_date)}
              </InfoBlock>

              <InfoBlock label="Geographical Focus" icon={MapPin}>
                <ul className="space-y-1">
                  {data.program_summary.geographical_focus.length > 0 ? (
                    data.program_summary.geographical_focus.map((country) => (
                      <li key={country.id}>
                        <p>{country.name}</p>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p>N/A</p>
                    </li>
                  )}
                </ul>
              </InfoBlock>

              <InfoBlock label="Beneficiaries" icon={Smile}>
                <ul className="space-y-1">
                  {data.program_summary.beneficiaries.length > 0 ? (
                    data.program_summary.beneficiaries.map((beneficiary) => (
                      <li key={beneficiary.id}>
                        <p>{beneficiary.name}</p>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p>N/A</p>
                    </li>
                  )}
                </ul>
              </InfoBlock>
            </div>

            <div className="space-y-8 md:px-10">
              <InfoBlock label="Status" icon={ToggleLeft}>
                {data.program_summary.status || "N/A"}
              </InfoBlock>

              <InfoBlock label="Budget" icon={HandCoins}>
                ${data.program_summary.budget.toLocaleString()}
              </InfoBlock>

              <InfoBlock label="Donors" icon={LifeBuoy}>
                <ul className="space-y-1">
                  {data.program_summary.donors.length > 0 ? (
                    data.program_summary.donors.map((donor) => (
                      <li key={donor.id}>
                        <p>{donor.name}</p>
                      </li>
                    ))
                  ) : (
                    <li>
                      <p>N/A</p>
                    </li>
                  )}
                </ul>
              </InfoBlock>
            </div>

            <div className="space-y-8 md:px-10">
              <InfoBlock label="Implementing Agencies" icon={Handshake}>
                <ul className="space-y-1">
                  {data.program_summary.implementing_agencies.length > 0 ? (
                    data.program_summary.implementing_agencies.map((agency) => (
                      <li key={agency.id}>
                        {agency.url ? (
                          <a href={agency.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                            {agency.name}
                          </a>
                        ) : (
                          <p>{agency.name}</p>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>
                      <p>N/A</p>
                    </li>
                  )}
                </ul>
              </InfoBlock>

              <InfoBlock label="Contact Person" icon={CircleUserRound}>
                <section>
                  <div className="mt-4 text-slate-700">
                    <p className="font-medium">
                      {data.program_summary.contact_person.first_name || ""} {data.program_summary.contact_person.last_name || ""}
                    </p>
                    <p>{data.program_summary.contact_person.title || "N/A"}</p>
                    <p className="text-blue-600">{data.program_summary.contact_person.email || "N/A"}</p>
                  </div>
                </section>
              </InfoBlock>
            </div>
          </section>
        </div>

        <div className="w-full flex justify-center py-5 pb-20 bg-slate-200">
          <section className="w-5/7 space-y-5">
            <InfoRow title="SDGs" description={""} icon={Leaf}/>
            {data.sdgs.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                {data.sdgs.map((sdg) => {
                  const imageUrl = sdg.image_url || `${import.meta.env.VITE_API_BASE_URL?.replace("/api/v1", "")}/storage/${sdg.image}`;

                  return (
                    <div key={sdg.id} className="group relative aspect-square w-full overflow-hidden rounded border-2 border-gray-200 bg-white hover:border-sky-400 transition-all">
                      <img
                        src={imageUrl}
                        alt={sdg.filename}
                        className="h-full w-full object-contain"
                      />
                      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none">
                        {sdg.filename}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-slate-600">No SDGs assigned.</p>
            )}
          </section>
        </div>

        <div className="w-full bg-slate-50">
          <section className="mx-auto w-5/7 pt-10">
            <InfoRow title="Projects Under the Program" description="Explore projects assigned to this program." icon={MapPin} />
          </section>
          <PublicProjectsExplorer
            programId={data.id}
            wrapperClassName="w-5/7"
            hideCountry
            programCountries={data.program_summary.geographical_focus}
          />
        </div>
      </div>
    </div>
  );
}

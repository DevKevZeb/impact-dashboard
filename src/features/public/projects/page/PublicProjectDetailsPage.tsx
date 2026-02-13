import { useParams } from "react-router-dom";
import { useProject } from "../hooks/useProjects";
import ProjectBanner from "../../components/ProjectBanner";
import InfoBlock from "../../components/InfoBlock";
import { CalendarDays, ChessKnight, CircleUserRound, ClipboardList, HandCoins, Handshake, LifeBuoy, List, Loader, MapPin, Smile, ToggleLeft } from "lucide-react";
import InfoRow from "../../components/InfoRow";

function formatDateEN(date: Date | string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}


export default function PublicProjectDetailsPage() {
  const { id } = useParams();
  const parsedId = Number(id);

  if (Number.isNaN(parsedId)) {
    return <div className="p-8 text-red-600">Invalid project</div>;
  }

  const { data, isLoading, error } = useProject(parsedId);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center py-20 min-h-[91vh] text-slate-500">
        <Loader className="loader-default"/>
        <p className="text-center">Loading project information…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex justify-center py-20 text-red-600">
        Failed to load project information
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">
      <ProjectBanner title={data.name} image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450-dark.png"/>

      <div className="mx-auto w-full flex flex-col justify-center items-center py-0">
        <section className="w-4/7 py-5 mb-10">
          <h2 className="section-title my-10">About the Project</h2>
          <p className="mt-4 text-slate-700 text-justify max-w-4xl">
            {data.description}
          </p>
        </section>

        <div className="w-full flex justify-center bg-slate-200">
          <section className="w-5/7 px-6 border-t-8 border-cyan-500 pt-20 grid grid-cols-1 md:grid-cols-3 gap-y-10 md:gap-x-0 md:divide-x md:divide-slate-300">
            <div className="space-y-8">
              <InfoBlock label="Start and End Date" icon={CalendarDays}>
                {formatDateEN(data.start_date)} – {formatDateEN(data.end_date)}
              </InfoBlock>

              <InfoBlock label="Geographical Focus" icon={MapPin}>
                {data.strategic_output.country_kpa?.country?.name}
              </InfoBlock>

              <InfoBlock label="Main Beneficiary" icon={Smile}>
                {data.beneficiary.name}
              </InfoBlock>
            </div>
            <div className="space-y-8 md:px-10">
              <InfoBlock label="Status" icon={ToggleLeft}>
                {data.project_state.state}
              </InfoBlock>

              <InfoBlock label="Budget" icon={HandCoins}>
                ${data.budget.toLocaleString()}
              </InfoBlock>

              <InfoBlock label="Donors" icon={LifeBuoy}>
                <ul className="space-y-1">
                  {data.donors.map((a) => (
                    <li key={a.name}><p>{a.name}</p></li>
                  ))}
                </ul>
              </InfoBlock>
            </div>
            <div className="space-y-8 md:px-10">
              <InfoBlock label="Implementing Agencies" icon={Handshake}>
                <ul className="space-y-1">
                  {data.agencies.map((a) => (
                    <li key={a.name}>
                      <a href={a.url} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline" >{a.name}</a>
                    </li>
                  ))}
                </ul>
              </InfoBlock>
              <InfoBlock label="Contact Person" icon={CircleUserRound}>
                <section>
                  <div className="mt-4 text-slate-700">
                    <p className="font-medium">
                      {data.contact.first_name} {data.contact.last_name}
                    </p>
                    <p>{data.contact.title}</p>
                    <p className="text-blue-600">{data.contact.email}</p>
                  </div>
                </section>
              </InfoBlock>
            </div>
          </section>
        </div>
        <div className="w-full flex justify-center py-5 pb-20 bg-slate-200">
          <section className="w-5/7 space-y-5">
            <InfoRow title="Policy Area" description={data.kpa.name} icon={List}/>
            <InfoRow title="Strategic Output" description={data.strategic_output.name} icon={ChessKnight}/>
            <InfoRow title="Measure" description={data.measure.name} icon={ClipboardList}/>
          </section>
        </div>
      </div>
    </div>
  );
}

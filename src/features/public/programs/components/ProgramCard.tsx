interface ProgramCardProps {
  id: number | string;
  name: string;
  description: string;
  programUrl?: string | null;
}

export default function ProgramCard({ id, name, description, programUrl }: ProgramCardProps) {
  const hasUrl = !!programUrl;

  return (
    <div
      key={id}
      className="flex flex-col overflow-hidden rounded-md bg-white shadow-md transition hover:shadow-lg"
    >
      <div className="h-78 w-full overflow-hidden">
        <img
          src="https://orchid-alligator-247477.hostingersite.com/wp-content/uploads/2022/04/grid-item-image.png"
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5 px-10">
        <h3 className="mb-2 line-clamp-2 text-xl font-bold text-secondary">{name}</h3>
        <p className="mb-6 line-clamp-5 text-gray-600">{description}</p>
        <div className="mt-auto">
          {hasUrl ? (
            <a
              href={programUrl as string}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary block w-full text-center"
            >
              VIEW PROGRAM
            </a>
          ) : (
            <button className="btn-secondary w-full opacity-70" disabled>
              VIEW PROGRAM
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

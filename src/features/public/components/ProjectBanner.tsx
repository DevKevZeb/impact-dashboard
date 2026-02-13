interface ProjectBannerProps {
  title: string;
  image: string;
}

export default function ProjectBanner({ title, image }: ProjectBannerProps) {
  return (
    <div className="relative bg-blue-900 h-[50vh] text-white">
      <div className={`absolute inset-0 bg-cover bg-center`} style={{ backgroundImage: `url('${image}')`}}>
        <div className="absolute inset-0 bg-black opacity-2"/>
      </div>
      <div className="relative mx-auto max-w-6xl flex justify-center items-center h-full px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-light">
          {title}
        </h1>
      </div>
    </div>
  );
}

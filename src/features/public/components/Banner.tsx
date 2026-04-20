interface BannerProps{
    title: string;
    description: string;
    image: string;
}

export default function Banner({title,description, image}: BannerProps){
    return(
        <div className="relative min-h-[500px] h-[50dvh] w-full overflow-hidden">
            <div className={`absolute inset-0 bg-cover bg-center`} style={{ backgroundImage: `url('${image}')`}}>
                <div className="absolute inset-0 bg-black opacity-2"/>
            </div>
             <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <h1 className="mb-4 head-label font-light">{title}</h1>
                <p className="mb-12 max-w-3xl text-lg text-slate-500 mt-2 *:md:text-2xl drop-shadow-md">{description}</p>
            </div>

        </div>
    )
}
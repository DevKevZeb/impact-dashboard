import { useRef } from "react";
import Hero from "../components/Hero";
import { ChartPie, FileSearch, FolderKey, Info, NotebookText } from "lucide-react";
import NavCard from "../components/NavCard";

export default function HomePage() {

    const contentRef = useRef<HTMLDivElement>(null);

    const images = 
    [
        'https://pacificecommerce.org/wp-content/uploads/2023/05/PIFS-Banner-1-scaled.jpg',
        'https://pacificecommerce.org/wp-content/uploads/2024/07/BSP-ATM-Machine_Mele-Kolo-2-scaled.jpg',
        'https://pacificecommerce.org/wp-content/uploads/2024/07/Eikosan-Boutqie_Eiko-Ahokava-10-scaled.jpg',
        'https://pacificecommerce.org/wp-content/uploads/2024/07/Hala-Unga-Studio_Sila-kivai-Puafisi-Julia-Puafisi-Maata-Puafisi-3-scaled.jpg',
        'https://pacificecommerce.org/wp-content/uploads/2024/07/Popua-Waterfront_Anaseini-Iotebatu-Mele-Kolo-11-scaled.jpg',
        'https://pacificecommerce.org/wp-content/uploads/2024/07/Start-Small-Dream-Big-shop_Leutu-Kiole-1-scaled.jpg'
    ];

    const navCardData = [
        {
            title: 'Programs',
            description:'Search for information on development programs supporting E-commerce in the Pacific',
            icon: FileSearch,
            to: '/development/programs',
        },
        {
            title: 'Business Toolkits',
            description:'Find practical toolkits to help your businesses move online',
            icon: FolderKey,
            to: '/resources/toolkits',
        },
        {
            title: 'Reports',
            description:'National and regional E-commerce diagnostic reports and strategies for Pacific Island Countries',
            icon: NotebookText,
            to: '/resources/reports',
        },
        {
            title: 'Statistics',
            description:'The most comprehensive compendium of E-commerce statistics available for the Pacific region',
            icon: ChartPie,
            to: '/statistics',
        },
        {
            title: 'About',
            description:'Learn about the mission and regional impact of the Pacific E-commerce Initiative',
            icon: Info,
            to: '/about',
        },

    ]
    return (
        <div>
            <Hero title="Pacific E-commerce Portal" subtitle="Your information repository on e-commerce development in the Pacific" images={images} scrollToRef={contentRef} transitionInterval={10000} overlayOpacity={40}  scrollButtonText="Scroll Down"/>
      
            <div className="flex flex-col items-center justify-center">
                <div ref={contentRef} className="min-h-screen py-8 w-5/7">
                    <h2 className="mt-20 mb-20 head-label">Contents</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {navCardData.map((item, index) => (
                            <NavCard key={index} title={item.title} description={item.description} icon={item.icon} to={item.to}/>
                        ))}

                    </div>
                </div>
            </div>
        </div>
    );
} 
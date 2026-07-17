import Banner from "../../components/Banner"
import PublicProjectsExplorer from "../components/PublicProjectsExplorer";

export default function ProjectsPublicPage(){
    return(
        <div>
            <Banner title="E-commerce Projects" description="Search and find information on national development partner projects which support e-commerce in the Pacific" image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"/>
            <PublicProjectsExplorer />
        </div>
    )
}

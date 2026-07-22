import Banner from "../../components/Banner"
import PublicProjectsExplorer from "../components/PublicProjectsExplorer";

export default function ProjectsPublicPage(){
    return(
        <div>
            <Banner title="E-commerce Projects" description="Search and find national projects supporting e-commerce development in Pacific Island countries." image="https://pacificecommerce.org/wp-content/uploads/2022/04/banner-450.png"/>
            <PublicProjectsExplorer />
        </div>
    )
}

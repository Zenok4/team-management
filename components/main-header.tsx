import { SidebarTrigger } from "./ui/sidebar";

const MainHeader = () => {
    return (
        <header className="w-full flex items-center py-2">
            <SidebarTrigger/>
            <h1 className="text-xl font-bold">My Application</h1>
        </header>
    );
}
 
export default MainHeader;
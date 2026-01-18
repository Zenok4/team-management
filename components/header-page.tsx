interface HeaderPageProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

const HeaderPage = ({title, children, subtitle }:HeaderPageProps) => {
    return (
        <div className="flex justify-between py-2 items-center">
            <div>
                <p className="text-2xl font-bold">{title}</p>
                <p className="text-lg">{subtitle}</p>
            </div>
            {children}
        </div>
    );
}
 
export default HeaderPage;
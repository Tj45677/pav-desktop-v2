type DesktopShellProps = {
    children: React.ReactNode;
};
                                                                                //desktop layout
export default function DesktopShell({ children }: DesktopShellProps) {
    return (
        <main
            style={{
                minHeight: "100vh",
                backgroundImage: "url('LAWallpaper.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                color: "white",
                fontFamily: "Consolas, monospace",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {children}
        </main>
    );
}
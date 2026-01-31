type VideoCardProps = {
    videoSrc: string;
    title: string;
    description: string;
}

export default function VideoCard({ videoSrc, title, description }: VideoCardProps) {
    return (
        <div className="w-full flex flex-col md:h-[600px] bg-white h-96 border border-border border-dashed rounded-lg overflow-hidden items-center justify-start">
            <video src={videoSrc} className="w-full h-[90%] object-cover" autoPlay loop muted playsInline />
            <div className="p-4 w-full h-full flex flex-col items-center justify-center">
                <h3 className="text-background text-sm uppercase">{title}</h3>
                <p className="text-muted-foreground text-sm">{description}</p>
            </div>
        </div>
    );
}
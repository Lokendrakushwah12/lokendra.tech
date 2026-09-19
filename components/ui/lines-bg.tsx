import { cn } from '@/lib/utils'

const LinesBG = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "relative left-1/2 -translate-x-1/2 flex h-10 w-screen border-y border-dashed",
                "before:absolute before:-left-[100vw] before:-z-1 before:h-10 before:w-[200vw]",
                "before:bg-[repeating-linear-gradient(315deg,var(--text-foreground)_0,var(--text-foreground)_1px,transparent_0,transparent_50%)] before:bg-size-[10px_10px] before:[--text-foreground:var(--cd-edge)]/80",
                className
            )}
        />
    )
}

export default LinesBG
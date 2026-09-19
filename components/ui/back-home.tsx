import Link from "next/link";
import { ReturnIcon } from "../icons";

const BackHome = ({
  label = "Home",
  current,
}: {
  label?: string;
  /** slug of the page you are on, shown after the separator */
  current?: string;
}) => {
  return (
    <aside className="w-fit my-4">
      <Link
        href="/"
        className="flex w-fit select-none items-center text-foreground outline-none duration-200 hover:opacity-60 focus-visible:ring-1 focus-visible:ring-foreground rounded-[10px]"
      >
        <div className="flex items-center gap-1">
          <ReturnIcon />
          <span className="text-xs font-[460] leading-none text-foreground">
            {label}
          </span>
          {current && (
            <>
              <span className="text-xs leading-none text-muted-foreground/60">
                /
              </span>
              <span className="text-xs font-[460] leading-none text-muted-foreground">
                {current}
              </span>
            </>
          )}
        </div>
      </Link>
    </aside>
  );
};

export default BackHome;

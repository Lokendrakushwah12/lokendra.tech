import Link from "next/link";
import { ReturnIcon } from "../icons";

/**
 * Sits inline above the content by default. The reference pins into the
 * gutter, but our columns are wide (max-w-4xl / 87em) so there is no room
 * until the viewport is very wide - hence it only pins past 1500px.
 */
const BackHome = ({
  label = "Home",
  current,
}: {
  label?: string;
  /** slug of the page you are on, shown after the separator */
  current?: string;
}) => {
  return (
    <aside className="static w-fit my-4 left-8 top-28 min-[1500px]:fixed min-[1500px]:mb-0 min-[1500px]:z-50">
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


import userData from "@/config/userData";
import CopyButton from "../ui/copy-button";
import GitHubGraph from "../ui/github-graph";
import LastUpdated from "../ui/last-updated";

const Footer = () => {
  const { email } = userData.personalInfo;

  return (
    <div className="border-b border-x border-border border-dashed sm:pb-0 pb-8">
      <div className="xl:border-x border-border border-dashed p-4 max-w-screen-xl w-full mx-auto space-y-4 py-8 md:py-16">
        <GitHubGraph />
        <div className="flex flex-col md:flex-row w-full justify-between gap-2 md:gap-1 items-start md:items-center mt-8">
        <div className="flex-col text-start text-muted-foreground">
          <p className="font-cursive text-5xl">
            Lokendra
          </p>
          <LastUpdated />
        </div>
          <div className="md:flex-grow hidden border-b border-dashed border-border" />
          <CopyButton email={email} />
        </div>
      </div>
    </div>
  );
};

export default Footer;
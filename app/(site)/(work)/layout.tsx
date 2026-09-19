import LinesBG from "@/components/ui/lines-bg";

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LinesBG />
      <div className="min-h-screen flex justify-start lg:flex-row flex-col">
        {children}
      </div>
      <LinesBG />
    </>
  );
}

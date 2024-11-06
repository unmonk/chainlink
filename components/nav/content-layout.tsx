import { Navbar } from "@/components/nav/navbar";

interface ContentLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function ContentLayout({ title, children }: ContentLayoutProps) {
  return (
    <div>
      <Navbar title={title} />
      <div className="container pt-8 pb-8 px-2 md:px-4">{children}</div>
    </div>
  );
}

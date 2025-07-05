import { cn } from "@/lib";

interface IProps {
  children: React.ReactNode;
  sectionId: string;
  backgroundColorClass?: string;
  containerClass?: string;
}

export function SectionContainer({ children, sectionId, backgroundColorClass, containerClass }: IProps) {
  return (
    <section className={cn("py-20 px-4", backgroundColorClass)} id={sectionId}>
      <div className={cn("container mx-auto", containerClass)}>
        {children}
      </div>
    </section>
  );
}

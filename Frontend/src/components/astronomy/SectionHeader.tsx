import { Badge } from "@/components/ui/badge";

interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  titleHighlight?: string;
  description?: string;
}

export function SectionHeader({
  badge,
  badgeIcon,
  title,
  titleHighlight,
  description,
}: SectionHeaderProps) {
  return (
    <div className="mb-10 text-center">
      {badge && (
        <Badge variant="outline" className="mb-4">
          {badgeIcon}
          {badge}
        </Badge>
      )}
      <h1 className="font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
        {title}{" "}
        {titleHighlight && (
          <span className="gradient-text-cyan">{titleHighlight}</span>
        )}
      </h1>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-white/50">{description}</p>
      )}
    </div>
  );
}

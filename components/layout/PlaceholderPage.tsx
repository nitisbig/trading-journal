import { Header } from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";

interface PlaceholderPageProps {
  title: string;
  description: string;
}

/** Generic "coming soon" page used by routes that aren't built yet. */
export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <>
      <Header title={title} />
      <div className="p-8">
        <Card className="flex min-h-64 flex-col items-center justify-center gap-2 text-center">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="max-w-sm text-sm text-ink-muted">{description}</p>
        </Card>
      </div>
    </>
  );
}

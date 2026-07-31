import { Link } from "react-router-dom";
import { EmptyState } from "@/components/ui/States";

export function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-6">
      <EmptyState
        icon="🧭"
        title="We couldn't find that page."
        description="It may have moved or the link was mistyped."
        action={
          <Link to="/today" className="mt-2 text-sm font-medium text-sprout-600 underline-offset-2 hover:underline">
            Go to Today
          </Link>
        }
      />
    </div>
  );
}

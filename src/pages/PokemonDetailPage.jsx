import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function PokemonDetailPage() {
  const { name } = useParams();

  return (
    <div>
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 transition-colors hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to list
      </Link>

      <h1 className="mt-4 text-3xl font-bold capitalize tracking-tight text-slate-900">
        {name}
      </h1>
      <p className="mt-2 text-slate-500">
        The details view is coming in a later step.
      </p>
    </div>
  );
}

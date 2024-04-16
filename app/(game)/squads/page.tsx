import { NewSquadForm } from "@/components/squads/new-squad-form";
import SquadSearch from "@/components/squads/squad-search";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

export default function Page() {
  return (
    <main className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Squads</h1>
      <div className="flex flex-row">
        <div className="justify-end">
          <NewSquadForm />
        </div>
      </div>
      <SquadSearch />
    </main>
  );
}

import { useState, type FormEvent } from "react";
import { Building2, MapPin, Search, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cityOptions, departmentOptions, validateSearch, type SearchFilters } from "@/data/search-options";

export function HospitalSearch() {
  const [f, setF] = useState<SearchFilters>({ city: "", department: "", name: "" });
  const [msg, setMsg] = useState<{ kind: "error" | "info"; text: string } | null>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const r = validateSearch(f);
    if (!r.ok) {
      setMsg({ kind: "error", text: r.error });
      return;
    }
    const text = `Hospital search results are not available yet. Your filters: ${r.summary}.`;
    setMsg({ kind: "info", text });
    toast("Search coming soon", { description: text });
  };

  const field = "h-12 w-full bg-background";
  const labelCls = "flex h-5 items-center gap-1.5 leading-none";

  return (
    <section aria-labelledby="search-title" className="relative z-10 mx-auto -mt-2 max-w-7xl px-4 sm:px-6 lg:-mt-10 lg:px-8">
      <form onSubmit={submit} noValidate className="rounded-2xl border border-border bg-card p-5 shadow-float sm:p-7">
        <div className="flex items-center gap-4">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-accent text-primary">
            <Building2 className="h-6 w-6" aria-hidden />
          </div>
          <div className="min-w-0">
            <h2 id="search-title" className="text-xl font-bold text-navy sm:text-2xl">Find a Hospital</h2>
            <p className="text-sm text-muted-foreground">Search participating hospitals across Ethiopia.</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-start">
          <div className="space-y-2">
            <Label htmlFor="city" className={labelCls}><MapPin className="h-4 w-4 text-primary" aria-hidden />City or Region</Label>
            <Select value={f.city} onValueChange={(city) => setF({ ...f, city })}>
              <SelectTrigger id="city" className={field}><SelectValue placeholder="Select city or region" /></SelectTrigger>
              <SelectContent>{cityOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept" className={labelCls}><Stethoscope className="h-4 w-4 text-primary" aria-hidden />Department</Label>
            <Select value={f.department} onValueChange={(department) => setF({ ...f, department })}>
              <SelectTrigger id="dept" className={field}><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>{departmentOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hname" className={labelCls}><Building2 className="h-4 w-4 text-primary" aria-hidden />Hospital name (optional)</Label>
            <Input id="hname" className={field} placeholder="Enter hospital name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
          </div>
          <div className="lg:pt-7">
            <Button type="submit" size="lg" className="h-12 w-full px-7 text-base lg:w-auto">
              <Search className="h-5 w-5" aria-hidden /> Search Hospitals
            </Button>
          </div>
        </div>
        {msg && (
          <p role={msg.kind === "error" ? "alert" : "status"} className={msg.kind === "error" ? "mt-4 text-sm font-medium text-destructive" : "mt-4 rounded-lg bg-accent px-4 py-3 text-sm text-navy"}>
            {msg.text}
          </p>
        )}
      </form>
    </section>
  );
}

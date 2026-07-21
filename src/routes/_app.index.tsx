import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Building2, Users, MapPin, UserCog, Wrench, ClipboardList } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app/")({
  component: Dashboard,
});

function useCount(table: "empresas" | "clientes" | "cidades" | "funcionarios" | "servicos" | "pedidos") {
  return useQuery({
    queryKey: ["count", table],
    queryFn: async () => {
      const { count, error } = await supabase.from(table).select("*", { count: "exact", head: true });
      if (error) throw error;
      return count ?? 0;
    },
  });
}

function StatCard({ title, value, icon: Icon, loading }: { title: string; value: number | undefined; icon: React.ElementType; loading: boolean }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{loading ? "—" : value}</div>
      </CardContent>
    </Card>
  );
}

function Dashboard() {
  const empresas = useCount("empresas");
  const clientes = useCount("clientes");
  const cidades = useCount("cidades");
  const funcionarios = useCount("funcionarios");
  const servicos = useCount("servicos");
  const pedidos = useCount("pedidos");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral do sistema (placeholder)</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Empresas" value={empresas.data} loading={empresas.isLoading} icon={Building2} />
        <StatCard title="Clientes" value={clientes.data} loading={clientes.isLoading} icon={Users} />
        <StatCard title="Cidades" value={cidades.data} loading={cidades.isLoading} icon={MapPin} />
        <StatCard title="Funcionários" value={funcionarios.data} loading={funcionarios.isLoading} icon={UserCog} />
        <StatCard title="Serviços" value={servicos.data} loading={servicos.isLoading} icon={Wrench} />
        <StatCard title="Pedidos" value={pedidos.data} loading={pedidos.isLoading} icon={ClipboardList} />
      </div>
    </div>
  );
}
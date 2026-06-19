import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20';
      case 'Accepted':
        return 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'In Progress':
        return 'bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/20';
      case 'Completed':
        return 'bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20';
      case 'Delivered':
        return 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
      default:
        return 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border-slate-500/20';
    }
  };

  return (
    <Badge variant="outline" className={`font-medium ${getColors()}`}>
      {status}
    </Badge>
  );
}

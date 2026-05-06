import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  iconColor?: string;
  iconBg?: string;
  prefix?: string;
  index?: number;
}

export function KpiCard({
  label, value, change, trend = 'neutral',
  icon: Icon, iconColor, iconBg, index = 0,
}: KpiCardProps) {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-rose-500' : 'text-muted-foreground';

  return (
    <Card
      className="relative overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-default animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Top accent bar */}
      <div className={cn('absolute top-0 left-0 right-0 h-0.5', iconBg || 'bg-primary')} />

      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', iconBg || 'bg-primary/10')}>
            <Icon className={cn('h-4.5 w-4.5', iconColor || 'text-primary')} size={18} />
          </div>
          {change && (
            <Badge variant="secondary" className={cn('text-[11px] font-semibold gap-0.5 px-1.5', trendColor, 'bg-transparent border-0')}>
              <TrendIcon className="h-3 w-3" />
              {change}
            </Badge>
          )}
        </div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">{label}</p>
        <p className="font-display text-2xl font-bold text-foreground leading-none">{value}</p>
      </CardContent>
    </Card>
  );
}

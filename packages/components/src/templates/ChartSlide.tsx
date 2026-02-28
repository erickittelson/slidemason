import type { ChartSlideProps } from './types';
import { Headline } from '../Headline';
import { BarChart } from '../dataviz/BarChart';
import { DonutChart } from '../dataviz/DonutChart';
import { PieChart } from '../dataviz/PieChart';
import { AreaChart } from '../dataviz/AreaChart';
import { StackedBar } from '../dataviz/StackedBar';
import { WaterfallChart } from '../dataviz/WaterfallChart';
import { ProgressBar } from '../dataviz/ProgressBar';
import { GaugeChart } from '../dataviz/GaugeChart';

export function ChartSlide({ title, subtitle, type, data, stackedData, direction, centerLabel, max, gaugeLabel }: ChartSlideProps) {
  let chart: React.ReactNode;
  switch (type) {
    case 'bar':
      chart = <BarChart bars={data} direction={direction} animate="stagger" />;
      break;
    case 'donut':
      chart = <DonutChart segments={data} centerLabel={centerLabel} animate="stagger" />;
      break;
    case 'pie':
      chart = <PieChart slices={data} animate="stagger" />;
      break;
    case 'area':
      chart = <AreaChart data={data} animate="stagger" />;
      break;
    case 'stacked-bar':
      chart = <StackedBar bars={stackedData || []} animate="stagger" />;
      break;
    case 'waterfall':
      chart = <WaterfallChart items={data} animate="stagger" />;
      break;
    case 'progress':
      chart = <ProgressBar value={data[0]?.value || 0} max={max} label={data[0]?.label} animate="stagger" />;
      break;
    case 'gauge':
      chart = <GaugeChart value={data[0]?.value || 0} max={max} label={gaugeLabel} animate="stagger" />;
      break;
  }

  return (
    <div className="flex flex-1 flex-col">
      {title && <Headline>{title}</Headline>}
      {subtitle && (
        <p className="sm-fade-up sm-stagger-1" style={{ fontSize: 'clamp(0.9rem, 1.5vw, 1.2rem)', color: 'var(--sm-muted)', margin: '0 0 clamp(1rem, 2vh, 2rem)' }}>
          {subtitle}
        </p>
      )}
      <div className="flex flex-1 items-center justify-center">
        {chart}
      </div>
    </div>
  );
}

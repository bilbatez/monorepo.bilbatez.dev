import { LegendItem } from '../primitives/LegendItem';

export type LegendEntry = {
  dotClass?: string;
  dotStyle?: React.CSSProperties;
  label: string;
  shape?: 'square' | 'circle';
};

type Props = { items: LegendEntry[] };

export function LegendRow({ items }: Props) {
  return (
    <div className="viz-legend">
      {items.map((item) => (
        <LegendItem key={item.label} {...item} />
      ))}
    </div>
  );
}

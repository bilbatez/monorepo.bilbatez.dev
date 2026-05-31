type Props = {
  dotClass?: string;
  dotStyle?: React.CSSProperties;
  label: string;
  shape?: 'square' | 'circle';
};

export function LegendItem({
  dotClass = '',
  dotStyle,
  label,
  shape = 'square',
}: Props) {
  return (
    <span className="flex items-center gap-1">
      <span
        className={`inline-block w-3 h-3 ${shape === 'circle' ? 'rounded-full' : 'rounded'} ${dotClass}`}
        style={dotStyle}
      />
      {label}
    </span>
  );
}

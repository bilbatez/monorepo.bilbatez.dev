type Props = {
  label: string;
  value: number | string;
  foundMessage?: string | null;
};

export function TargetIndicator({ label, value, foundMessage }: Props) {
  return (
    <div className="text-sm font-medium text-gray-600 dark:text-gray-300">
      {label}:{' '}
      <span className="font-bold text-[var(--color-turquoise-dark)]">
        {value}
      </span>
      {foundMessage && (
        <span className="ml-3 text-green-500 font-medium">{foundMessage}</span>
      )}
    </div>
  );
}

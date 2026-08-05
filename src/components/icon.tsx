type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

/** Material Symbols Outlined icon, matching the original mockup's usage. */
export function Icon({ name, className = "", filled = false }: IconProps) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={filled ? { fontVariationSettings: "'FILL' 1" } : undefined}
    >
      {name}
    </span>
  );
}

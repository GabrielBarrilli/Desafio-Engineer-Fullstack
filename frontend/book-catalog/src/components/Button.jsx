export function Button({ children, variant = 'primary', ...props }) {
  const base = 'px-3 py-1 rounded text-sm font-medium';
  const styles = {
    primary:  'bg-emerald-600 hover:bg-emerald-500 text-white',
    danger:   'bg-red-700 hover:bg-red-600 text-white',
    warning:  'bg-yellow-600 hover:bg-yellow-500 text-white',
    link:     'text-blue-400 hover:underline px-0 py-0',
  };
  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}

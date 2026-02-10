type TextareaFieldProps = {
  id: string;
  label: string;
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function TextareaField({
  id,
  label,
  value,
  placeholder,
  disabled = false,
  onChange,
}: TextareaFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[140px] w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-400"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

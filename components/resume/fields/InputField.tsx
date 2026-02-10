type InputFieldProps = {
  id: string;
  label: string;
  type?: "text" | "email";
  value: string;
  placeholder?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export default function InputField({
  id,
  label,
  type = "text",
  value,
  placeholder,
  disabled = false,
  onChange,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none ring-0 transition focus:border-slate-400"
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}

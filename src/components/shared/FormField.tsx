interface FormFieldProps {
  id: string;
  label: string;
  type: "email" | "password";
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  testId: string;
  autoComplete?: string;
  required?: boolean;
}

export default function FormField({
  id,
  label,
  type,
  value,
  onChange,
  testId,
  autoComplete,
  required,
}: FormFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="font-body text-sm font-medium text-ink">
        {label}
      </label>
      <input
        suppressHydrationWarning
        className="w-full bg-surface border border-border rounded-sm
          px-4 py-3 font-body text-base text-ink
          placeholder:text-muted
          focus:outline-none focus:border-ink
          transition-colors duration-150"
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        data-testid={testId}
        autoComplete={autoComplete}
        required={required}
      />
    </div>
  );
}

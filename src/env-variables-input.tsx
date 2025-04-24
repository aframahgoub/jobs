import React from "react";

interface EnvVariable {
  key: string;
  placeholder: string;
}

interface EnvVariablesInputProps {
  variables: EnvVariable[];
  title: string;
}

export default function EnvVariablesInput({
  variables,
  title,
}: EnvVariablesInputProps) {
  return (
    <div className="env-variables-input">
      <h2>{title}</h2>
      <div className="variables-list">
        {variables.map((variable) => (
          <div key={variable.key} className="variable-item">
            <label htmlFor={variable.key}>{variable.key}</label>
            <input
              id={variable.key}
              type="text"
              placeholder={variable.placeholder}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

// Example usage:
// <EnvVariablesInput
//   variables={[
//     {
//       key: "NEXT_PUBLIC_SUPABASE_URL",
//       placeholder: "https://your-project.supabase.co"
//     },
//     {
//       key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
//       placeholder: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
//     }
//   ]}
//   title="Configure Supabase Credentials"
// />

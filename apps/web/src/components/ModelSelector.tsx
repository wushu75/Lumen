import { models } from "../lib/rag-client.js";

export function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
      <span style={{ color: "#666" }}>Model</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ padding: "6px 8px", borderRadius: 8, border: "1px solid #d0d0d8" }}
      >
        {models().map((m) => (
          <option key={m.id} value={m.id}>
            {m.name} ({m.default_tag})
          </option>
        ))}
      </select>
    </label>
  );
}

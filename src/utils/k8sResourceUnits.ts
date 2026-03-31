/**
 * Kubernetes resource unit conversion utilities for CPU and Memory.
 *
 * Form values are always plain numbers:
 *   CPU   → stored in millicores (m)
 *   Memory → stored in Mebibytes (Mi)
 *
 * Conversion rules (Form → YAML):
 *   CPU    {n} → "{n}m"
 *   Memory {n} → "{n}Mi"
 *
 * Conversion rules (YAML → Form):
 *   CPU  "{n}m"    → n
 *   CPU  "{n}"     → n × 1000   (whole cores)
 *   Mem  "{n}Mi"   → n
 *   Mem  "{n}Gi"   → n × 1024
 *   Other          → parse error
 */

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

/** Form number → Kubernetes CPU string (millicores). */
export function formCpuToYaml(n: string | number): string {
  return `${n}m`;
}

/** Form number → Kubernetes memory string (Mebibytes). */
export function formMemoryToYaml(n: string | number): string {
  return `${n}Mi`;
}

/**
 * Parse a Kubernetes CPU string → form number (millicores).
 * - "{n}m"      → n
 * - "{n}" (int) → n × 1000
 */
export function yamlCpuToForm(s: string): ParseResult<number> {
  const milliMatch = s.match(/^(\d+(?:\.\d+)?)m$/);
  if (milliMatch) return { ok: true, value: parseFloat(milliMatch[1]) };

  const intMatch = s.match(/^(\d+(?:\.\d+)?)$/);
  if (intMatch) return { ok: true, value: parseFloat(intMatch[1]) * 1000 };

  return { ok: false, error: `Invalid CPU value: "${s}". Expected "{n}m" or integer.` };
}

/**
 * Parse a Kubernetes memory string → form number (Mi).
 * - "{n}Mi" → n
 * - "{n}Gi" → n × 1024
 */
export function yamlMemoryToForm(s: string): ParseResult<number> {
  const miMatch = s.match(/^(\d+(?:\.\d+)?)Mi$/);
  if (miMatch) return { ok: true, value: parseFloat(miMatch[1]) };

  const giMatch = s.match(/^(\d+(?:\.\d+)?)Gi$/);
  if (giMatch) return { ok: true, value: parseFloat(giMatch[1]) * 1024 };

  return {
    ok: false,
    error: `Invalid memory value: "${s}". Expected "{n}Mi" or "{n}Gi".`,
  };
}

/** Parse CPU string and fall back to a default on error, logging the error. */
export function parseCpuSafe(s: string, fallback = 0): number {
  const result = yamlCpuToForm(s);
  if (!result.ok) {
    console.error('[k8sResourceUnits]', result.error);
    return fallback;
  }
  return result.value;
}

/** Parse memory string and fall back to a default on error, logging the error. */
export function parseMemorySafe(s: string, fallback = 0): number {
  const result = yamlMemoryToForm(s);
  if (!result.ok) {
    console.error('[k8sResourceUnits]', result.error);
    return fallback;
  }
  return result.value;
}

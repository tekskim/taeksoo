/**
 * Kubernetes resource unit conversion utilities for CPU and Memory.
 *
 * K8s Quantity normalization rules (from k8s.io/apimachinery/pkg/api/resource):
 *   - Canonical form has no fractional digits.
 *   - The suffix is as large as possible ("1024Mi" → "1Gi", "1.5" CPU → "1500m").
 *   - Values are serialized as fixed-point; floating-point is never used internally.
 *
 * ─────────────────────────────────────────────────────
 * Form → YAML  (Form stores plain positive integers)
 * ─────────────────────────────────────────────────────
 *   CPU    {n} mCPUs → "{n}m"    K8s may normalize: "1000m" → "1", "2000m" → "2"
 *   Memory {n} MiB   → "{n}Mi"  K8s may normalize: "1024Mi" → "1Gi", "2048Mi" → "2Gi"
 *   empty            → field omitted (no restriction / unlimited)
 *
 * ─────────────────────────────────────────────────────
 * YAML → Form  (covers K8s canonical output + common non-canonical inputs)
 * ─────────────────────────────────────────────────────
 * CPU → mCPUs:
 *   "{n}m"   integer n  → n
 *   "{n}"    integer n  → n × 1000          (whole cores; K8s canonical for multiples of 1000m)
 *   "{n.n}"  decimal n  → round(n × 1000)   (e.g. "0.5" → 500, "1.5" → 1500)
 *                         K8s normalizes these to "{integer}m" before storing,
 *                         but we handle them for pre-save YAML preview safety.
 *   other               → parse error
 *   Blocked: decimal millicores e.g. "500.5m" (no practical meaning; K8s rounds up)
 *
 * Memory → MiB:
 *   "{n}Mi"    integer n → n
 *   "{n}Gi"    integer n → n × 1024         (K8s canonical for bytes divisible by 2^30)
 *   "{n.n}Gi"  decimal n → result if integer, else error
 *                         (e.g. "1.5Gi" → 1536, "0.5Gi" → 512)
 *                         K8s normalizes these to "{integer}Mi" before storing.
 *   "{n}Ti"    integer n → n × 1024 × 1024  (K8s canonical for bytes divisible by 2^40)
 *   other               → parse error
 *   Blocked: Ki (sub-MiB, impractical for quotas), DecimalSI (G/M ≠ Gi/Mi, confusing)
 *
 * ─────────────────────────────────────────────────────
 * YAML validation  (what the YAML editor accepts before saving)
 * ─────────────────────────────────────────────────────
 *   CPU   : positive "{integer}m"  (decimal millicores rejected — K8s rounds them up)
 *           positive "{number}"    (integer or decimal cores up to 3 decimal places)
 *   Memory: positive "{integer}Mi", "{number}Gi", "{integer}Ti"
 *   Blocked: "1G", "1M", "1Ki", "1Pi", "1Ei", exponent notation
 */

export type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string };

// ─────────────────────────────────────────────────────
// Form → YAML
// ─────────────────────────────────────────────────────

/** Form integer (mCPUs) → Kubernetes CPU string. */
export function formCpuToYaml(n: string | number): string {
  return `${n}m`;
}

/** Form integer (MiB) → Kubernetes memory string. */
export function formMemoryToYaml(n: string | number): string {
  return `${n}Mi`;
}

// ─────────────────────────────────────────────────────
// YAML → Form
// ─────────────────────────────────────────────────────

/**
 * Parse a Kubernetes CPU string → form integer (millicores).
 *
 * Accepted:
 *   "{n}m"   integer millicores  → n
 *   "{n}"    integer cores       → n × 1000
 *   "{n.n}"  decimal cores       → round(n × 1000)   e.g. "0.5" → 500, "1.5" → 1500
 */
export function yamlCpuToForm(s: string): ParseResult<number> {
  const milliMatch = s.match(/^(\d+)m$/);
  if (milliMatch) return { ok: true, value: parseInt(milliMatch[1], 10) };

  const coreMatch = s.match(/^(\d+(?:\.\d+)?)$/);
  if (coreMatch) return { ok: true, value: Math.round(parseFloat(coreMatch[1]) * 1000) };

  return {
    ok: false,
    error: `지원하지 않는 CPU 값: "${s}". "{n}m"(정수 밀리코어) 또는 "{n}"(정수/소수 코어) 형식만 허용됩니다.`,
  };
}

/**
 * Parse a Kubernetes memory string → form integer (MiB).
 *
 * Accepted:
 *   "{n}Mi"    integer n → n
 *   "{n}Gi"    integer n → n × 1024
 *   "{n.n}Gi"  decimal n → n × 1024, only when result is a whole number
 *              e.g. "1.5Gi" → 1536, "0.5Gi" → 512, "0.1Gi" → error (102.4 is not integer)
 *   "{n}Ti"    integer n → n × 1024 × 1024
 */
export function yamlMemoryToForm(s: string): ParseResult<number> {
  const miMatch = s.match(/^(\d+)Mi$/);
  if (miMatch) return { ok: true, value: parseInt(miMatch[1], 10) };

  const giMatch = s.match(/^(\d+(?:\.\d+)?)Gi$/);
  if (giMatch) {
    const mib = parseFloat(giMatch[1]) * 1024;
    if (!Number.isInteger(mib)) {
      return {
        ok: false,
        error: `"${s}"는 MiB 정수로 변환되지 않습니다. 정수 MiB 결과를 갖는 값만 허용됩니다.`,
      };
    }
    return { ok: true, value: mib };
  }

  const tiMatch = s.match(/^(\d+)Ti$/);
  if (tiMatch) return { ok: true, value: parseInt(tiMatch[1], 10) * 1024 * 1024 };

  return {
    ok: false,
    error: `지원하지 않는 Memory 값: "${s}". "{n}Mi", "{n}Gi", "{n}Ti" 형식만 허용됩니다.`,
  };
}

// ─────────────────────────────────────────────────────
// YAML validation  (used by YAML editor before saving)
// ─────────────────────────────────────────────────────

/**
 * Validate a CPU string entered in the YAML editor.
 * Accepts:  "{integer}m"  or  "{number}" (decimal cores allowed)
 * Rejects:  decimal millicores e.g. "500.5m" (K8s rounds these up — avoid ambiguity)
 * Returns an error message if invalid, null if valid.
 */
export function validateCpuYaml(s: string): string | null {
  if (!s) return null;
  if (/^\d+m$/.test(s)) return null;
  if (/^\d+(\.\d+)?$/.test(s)) return null;
  return `CPU 값 "${s}"은 유효하지 않습니다. "{n}m"(정수 밀리코어) 또는 "{n}"(정수/소수 코어) 형식으로 입력하세요.`;
}

/**
 * Validate a memory string entered in the YAML editor.
 * Accepts:  "{integer}Mi", "{number}Gi" (decimal Gi allowed; K8s normalizes to Mi),
 *           "{integer}Ti"
 * Rejects:  Ki (sub-MiB), DecimalSI (G/M ≠ Gi/Mi), Pi/Ei, exponent notation.
 * Returns an error message if invalid, null if valid.
 */
export function validateMemoryYaml(s: string): string | null {
  if (!s) return null;
  if (/^\d+Mi$/.test(s)) return null;
  if (/^\d+(\.\d+)?Gi$/.test(s)) return null;
  if (/^\d+Ti$/.test(s)) return null;
  return `Memory 값 "${s}"은 유효하지 않습니다. "{n}Mi", "{n}Gi", "{n}Ti" 형식으로 입력하세요.`;
}

// ─────────────────────────────────────────────────────
// Safe parse helpers  (for loading saved K8s values into Form)
// ─────────────────────────────────────────────────────

/**
 * Parse a CPU string from K8s API.
 * Returns the integer mCPU value on success, or null on error.
 */
export function parseCpuSafe(s: string): number | null {
  const result = yamlCpuToForm(s);
  if (!result.ok) {
    console.error('[k8sResourceUnits]', result.error);
    return null;
  }
  return result.value;
}

/**
 * Parse a memory string from K8s API.
 * Returns the integer MiB value on success, or null on error.
 */
export function parseMemorySafe(s: string): number | null {
  const result = yamlMemoryToForm(s);
  if (!result.ok) {
    console.error('[k8sResourceUnits]', result.error);
    return null;
  }
  return result.value;
}

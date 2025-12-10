export interface TransformResult {
  success: boolean;
  payload: Record<string, unknown>;
  errors?: string[];
}

export interface ModuleMapper {
  transform(input: Record<string, unknown>): TransformResult;
}

export function cleanCnpjCpf(value: string): string {
  return value.replace(/[.\-/]/g, '');
}

export function formatDate(date: string): string {
  if (!date) return '';
  if (date.includes('T')) {
    return date.split('T')[0];
  }
  return date;
}

export function extractValue(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  return path.split('.').reduce<unknown>((current, key) => {
    if (current && typeof current === 'object' && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

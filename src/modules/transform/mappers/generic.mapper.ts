import { ModuleMapper, TransformResult } from './base.mapper';

export class GenericMapper implements ModuleMapper {
  constructor(private readonly moduleName: string) {}

  transform(input: Record<string, unknown>): TransformResult {
    const wrapperKey = `dados${this.capitalize(this.moduleName)}`;

    const payload: Record<string, unknown> = {
      [wrapperKey]: {
        ...input,
        _transformedAt: new Date().toISOString(),
      },
    };

    return { success: true, payload };
  }

  private capitalize(str: string): string {
    return str
      .toLowerCase()
      .replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase())
      .replace(/^[a-z]/, (letter) => letter.toUpperCase());
  }
}

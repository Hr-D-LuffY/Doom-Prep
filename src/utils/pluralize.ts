// pluralize(1, "bundle") -> "1 bundle", pluralize(3, "bundle") -> "3 bundles"
export const pluralize = (
  count: number,
  singular: string,
  plural = `${singular}s`,
): string => `${count} ${count === 1 ? singular : plural}`;

export function getPagination(page?: number, limit?: number) {
  const resolvedPage = page && page > 0 ? page : 1;
  const resolvedLimit = limit && limit > 0 && limit <= 100 ? limit : 12;

  return {
    page: resolvedPage,
    limit: resolvedLimit,
    skip: (resolvedPage - 1) * resolvedLimit,
  };
}

export const getPagination = (
  current: number,
  total: number,
  delta = 1
) => {
  const pages: (number | string)[] = [];
  const left = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  pages.push(1);

  if (left > 2) pages.push("...");

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total - 1) pages.push("...");

  if (total > 1) pages.push(total);

  return pages;
};

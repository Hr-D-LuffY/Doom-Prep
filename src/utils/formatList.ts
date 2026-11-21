// [4] -> "4", [4, 6] -> "4 and 6", [2, 5, 10] -> "2, 5 and 10"
export const formatList = (items: Array<string | number>): string => {
  const texts = items.map(String);
  if (texts.length <= 1) return texts.join("");
  if (texts.length === 2) return `${texts[0]} and ${texts[1]}`;
  return `${texts.slice(0, -1).join(", ")} and ${texts.at(-1)}`;
};

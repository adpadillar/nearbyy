const palletes = [
  ["#FFC312", "#EE5A24"],
  ["#D980FA", "#9980FA"],
  ["#12CBC4", "#1289A7"],
  ["#FDA7DF", "#B53471"],
  ["#ED4C67", "#B53471"],
];

export function hashToColors(key: string): {
  foreground: string;
  background: string;
} {
  const randomIndex =
    Math.abs(key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) %
    palletes.length;
  return {
    background: palletes[randomIndex]![0]!,
    foreground: palletes[randomIndex]![1]!,
  };
}

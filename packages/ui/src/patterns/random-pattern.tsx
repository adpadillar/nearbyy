import JigwasPattern from "./jigsaw";

const patterns = [JigwasPattern];

export interface PatternProps {
  backgroundColor: string;
  pathColor: string;
  className?: string;
  fillOpacity?: number;
}

export function hashToPattern(key: string) {
  return patterns[key.length % patterns.length]!;
}

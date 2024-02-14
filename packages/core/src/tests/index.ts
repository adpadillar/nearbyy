import { it as internalIt } from "vitest";

// This contains files .md and .txt, which are supported by the server
export const supportedFiles = [
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Dependency%20Injection.md?alt=media&token=fb9a93fe-5998-46ac-b2e8-d5966e28013a",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/melisearch.md?alt=media&token=f6d8d9d6-c798-4f29-9247-71bd194ab368",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/how-to-launch-y-combinator.md?alt=media&token=55cd5731-b132-4163-8910-1a2bc9acc43d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/home.md?alt=media&token=05c7c09e-b759-40a8-82ce-9844e4c3a114",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/garlic.txt?alt=media&token=df67d4de-ed44-4060-b2c2-205a650a8f2d",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/consentimiento-informado.md?alt=media&token=4e1aadfc-35c1-4245-9a2e-6be01979134d",
];

// This contains files .pdf, which are not supported by the server Yet
export const unsupportedFiles = [
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Abstraccio%CC%81n%20de%20datos%20(ADT).pdf?alt=media&token=5bbf92c6-6276-4fcc-ba13-3a764f7294fc",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/Fuerzas%20de%20la%20industria.pdf?alt=media&token=aef42c15-0d2d-437e-8843-3850126e707a",
  "https://firebasestorage.googleapis.com/v0/b/hackmty23.appspot.com/o/REGLAMENTO%20DE%20VIAJES%20PARA%20ESTUDIANTES%20(Hackathon%20Monterrey%202023).pdf?alt=media&token=6b76b1dc-c247-4f8d-abfd-326f23ee7c8e",
];

// wrap the it function to add a timeout of 30 seconds
export const it = (name: string, fx: () => unknown) =>
  internalIt(name, fx, { timeout: 30 * 1000 });

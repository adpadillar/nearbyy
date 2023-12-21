export const name = "core";

export const version = "1.0.0";

export const sayHello = () => {
  console.log(`Hello from ${name} v${version}`);
};

export const sum = (a: number, b: number) => a + b;

import { tidy, mutate, arrange, desc, groupBy } from "@tidyjs/tidy";

const data = [
  { g: "a", h: "x", value: 5 },
  { g: "a", h: "y", value: 15 },
  { g: "b", h: "x", value: 10 },
  { g: "b", h: "x", value: 20 },
  { g: "b", h: "y", value: 30 },
];

const a = tidy(
  data,
  groupBy(
    ["g", "h"],
    [mutate({ key: (d) => `\${d.g}\${d.h}` })],
    groupBy.object() // <-- specify the export
  )
);

console.log(JSON.stringify(a));

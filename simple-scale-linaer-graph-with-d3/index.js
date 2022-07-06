import * as d3 from 'd3';

function scale(domain, range) {
  const m = (range[1] - range[0]) / (domain[1] - domain[0]);
  return (num) => range[0] + m * (num - domain[0]);
}

const data = [
  {x: 0, y: 0},
  {x: 1, y: 1},
  {x: 2, y: 4},
  {x: 3, y: 9},
  {x: 4, y: 16},
  {x: 5, y: 25},
  {x: 6, y: 36},
  {x: 7, y: 49},
  {x: 8, y: 64},
  {x: 9, y: 81},
  {x: 10, y: 100},
];

const x = scale([0, Math.max(...data.map((d) => d.x))], [0, 300]);
const y = scale([0, Math.max(...data.map((d) => d.y))], [100, 0]);

let points;

points = data.map((d) => `${x(d.x)},${y(d.y)}`).join(' ');

console.log(`[my]:${points}`);

const myScaleX = d3.scaleLinear().domain([0, 10]).range([0, 300]);

const myScaleY = d3.scaleLinear().domain([0, 100]).range([100, 0]);

points = data.map((d) => `${myScaleX(d.x)},${myScaleY(d.y)}`).join(' ');

console.log(`[d3]:${points}`);

const chart = `
<svg width="300" height="100">
  <!-- x axis -->
  <line x1="0" x2="300" y1="100" y2="100"></line>
  <g class="x" transform="translate(0,120)">
    <text x="0">0</text>
    <text x="60">2</text>
    <text x="120">4</text>
    <text x="180">6</text>
    <text x="240">8</text>
    <text x="300">10</text>
  </g>

  <!-- y axis -->
  <line x1="0" x2="0" y1="0" y2="100"></line>
  <g class="y" transform="translate(-10,0)">
    <text y="100">0</text>
    <text y="50">50</text>
    <text y="0">100</text>
  </g>
  <polyline style="stroke: green; stroke-width: 2" points="${points}"></polyline>
</svg>
`;

const workspaceDom = document.querySelector('body');

workspaceDom.innerHTML = chart;

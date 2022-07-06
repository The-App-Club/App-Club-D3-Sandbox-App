import * as d3 from 'd3';

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

const myScaleX = d3.scaleLinear().domain([0, 10]).range([0, 300]);

const myScaleY = d3.scaleLinear().domain([0, 100]).range([100, 0]);

const points = data.map((d) => `${myScaleX(d.x)},${myScaleY(d.y)}`).join(' ');

const myScaleColor = d3.scaleLinear().domain([0, 10]).range(['blue', 'pink']);

const colorList = data.map((d) => {
  return myScaleColor(d.x);
});

const createCircleDomHTML = () => {
  let result = '<g>';
  result =
    result +
    data
      .map(
        (d, i) =>
          `<circle fill="${colorList[i]}" cx="${myScaleX(d.x)}" cy="${myScaleY(
            d.y
          )}" r="5" />`
      )
      .join('\n');
  return result + '</g>';
};

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
  ${createCircleDomHTML()}
  <polyline style="stroke: green; stroke-width: 2" points="${points}"></polyline>
</svg>
`;

const workspaceDom = document.querySelector('body');

workspaceDom.innerHTML = chart;

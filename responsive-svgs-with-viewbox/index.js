import * as d3 from 'd3';

function render() {
  const viewBoxWidth =
    parameter.squareSize * parameter.countSquares + 2 * parameter.marginSize;
  const viewBoxHeight =
    parameter.squareSize * parameter.countSquares + 2 * parameter.marginSize;

  const svgDom = d3
    .select('.workspace')
    .append('svg')
    .attr('width', '100%')
    .attr('viewBox', `0 0 ${viewBoxWidth} ${viewBoxHeight}`);

  const data = d3.range(parameter.countSquares).map(function (d, i) {
    return i;
  });

  // draw a rect to act as an outline
  svgDom
    .append('rect')
    .style('fill', '#888')
    .attr('width', viewBoxWidth)
    .attr('height', viewBoxHeight);

  svgDom
    .selectAll('g')
    .data(data)
    .enter()
    .append('g')
    .selectAll('rect')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', function (d) {
      return d * parameter.squareSize + parameter.marginSize;
    })
    .attr('y', function () {
      var i = d3.select(this.parentNode).datum();
      return i * parameter.squareSize + parameter.marginSize;
    })
    .attr('width', parameter.squareSize)
    .attr('height', parameter.squareSize)
    .style('fill', function (d) {
      var i = d3.select(this.parentNode).datum();
      if ((i + d) % 2 !== 0) {
        return 'black';
      }
      return 'white';
    });
}

function removeAllSvgDom() {
  const workspaceDom = document.querySelector('.workspace');
  const svgDomList = [...workspaceDom.querySelectorAll('svg')];
  for (let index = 0; index < svgDomList.length; index++) {
    const svgDom = svgDomList[index];
    svgDom.parentElement.removeChild(svgDom);
  }
}

function initialize() {
  const workspaceDom = document.querySelector('.workspace');
  workspaceDom.style.width = `${parameter.workspaceWidth}px`;
  workspaceDom.style.height = `${parameter.workspaceHeight}px`;
}

let stats;
stats = new Stats();
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = 0;
stats.domElement.style.top = 0;
document.body.appendChild(stats.domElement);

// https://mathisonian.com/writing/easy-responsive-svgs-with-viewbox
let parameter = {
  workspaceWidth: 200,
  workspaceHeight: 200,
  marginSize: 1,
  squareSize: 20,
  countSquares: 10,
};

// https://github.com/GRI-Inc/App-Club-Image-Clean-App/blob/main/image-proportion/index.js#L251
let controllerInfo = {
  'Workspace Width': 200,
  'Workspace Height': 200,
  'Margin Size': 1,
  'Square Size': 20,
  'Count Square': 10,
};

const gui = new dat.GUI();
gui.width = 300;
gui
  .add(controllerInfo, 'Workspace Width', 200, window.innerWidth, 1)
  .onChange((event) => {
    detectChangeParameter(event, 'Workspace Width');
  });
gui
  .add(controllerInfo, 'Workspace Height', 200, window.innerHeight, 1)
  .onChange((event) => {
    detectChangeParameter(event, 'Workspace Height');
  });
gui.add(controllerInfo, 'Count Square', 1, 100, 1).onChange((event) => {
  detectChangeParameter(event, 'Count Square');
});
gui.add(controllerInfo, 'Margin Size', 1, 4, 2).onChange((event) => {
  detectChangeParameter(event, 'Margin Size');
});
gui.add(controllerInfo, 'Square Size', 1, 60, 1).onChange((event) => {
  detectChangeParameter(event, 'Square Size');
});
gui.add(controllerInfo, 'Count Square', 1, 100, 1).onChange((event) => {
  detectChangeParameter(event, 'Count Square');
});

function detectChangeParameter(event, keyName) {
  if (keyName === 'Workspace Width') {
    parameter.workspaceWidth = event;
  }
  if (keyName === 'Workspace Height') {
    parameter.workspaceHeight = event;
  }
  if (keyName === 'Margin Size') {
    parameter.marginSize = event;
  }
  if (keyName === 'Square Size') {
    parameter.squareSize = event;
  }
  if (keyName === 'Count Square') {
    parameter.countSquares = event;
  }
  removeAllSvgDom();
  initialize();
  render();
}

function loop() {
  requestAnimationFrame(loop);
  stats.begin();
  stats.end();
}

initialize();
render();
loop();

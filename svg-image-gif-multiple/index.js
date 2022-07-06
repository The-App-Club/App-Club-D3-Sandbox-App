import * as d3 from 'd3';

const height = 200;
const width = 300;

const dataInfoList = [
  {webURL: 'https://media.giphy.com/media/5gK1hvwoutPnG/giphy.gif'},
  {webURL: 'https://media.giphy.com/media/11KzOet1ElBDz2/giphy.gif'},
  {webURL: 'https://media.giphy.com/media/iIkP9O94wiFlm/giphy.gif'},
];

const svg = d3
  .select('.workspace')
  .append('svg')
  .attr('width', width)
  .attr('preserveAspectRatio', 'xMinYMin meet')
  .attr('viewBox', `0 0 ${width} ${height}`);

const dataCount = dataInfoList.length;
const rowCount = 3;
const colCount = 2;
const itemWidth = width / colCount;
const itemHeight = height / rowCount;

for (let index = 0; index < dataInfoList.length; index++) {
  const dataInfo = dataInfoList[index];
  const {webURL} = {...dataInfo};

  const image = svg
    .append('symbol')
    .attr('id', index)
    .attr('width', itemWidth)
    .attr('height', itemHeight)
    .attr('viewBox', `0 0 ${itemWidth} ${itemHeight}`)
    .append('image')
    .attr('width', itemWidth)
    .attr('height', itemHeight)
    .attr('xlink:href', webURL);
}

for (let i = 0; i < rowCount; i++) {
  for (let j = 0; j < colCount; j++) {
    // const use = svg
    //   .append("use")
    //   .attr("xlink:href", `#${Math.min(Math.abs(i), Math.abs(j)) % dataCount}`)
    //   .attr("x", itemWidth * j)
    //   .attr("y", itemHeight * i);

    // const use = svg
    // .append("use")
    // .attr("xlink:href", `#${Math.max(Math.abs(i), Math.abs(j)) % dataCount}`)
    // .attr("x", itemWidth * j)
    // .attr("y", itemHeight * i);

    const use = svg
      .append('use')
      .attr('xlink:href', `#${(Math.abs(i) + Math.abs(j)) % dataCount}`)
      .attr('x', itemWidth * j)
      .attr('y', itemHeight * i);
  }
}

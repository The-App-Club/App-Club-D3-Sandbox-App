import * as d3 from 'd3';

// https://www.d3indepth.com/selections/
const tooltipDom = document.querySelector('.tooltip');

const myData = [
  {
    name: 'Andy',
    score: 37,
  },
  {
    name: 'Beth',
    score: 39,
  },
  {
    name: 'Craig',
    score: 31,
  },
  {
    name: 'Diane',
    score: 35,
  },
  {
    name: 'Evelyn',
    score: 38,
  },
];

// set data and dom
d3.select('.workspace')
  .append('svg')
  .attr('width', 800)
  .attr('height', 500)
  .append('g')
  .selectAll('circle')
  .data(myData)
  .enter()
  .append('g')
  .classed('item', true)
  .append('circle')
  .attr('fill', 'black')
  .attr('r', 11)
  .attr('cx', (d, i) => {
    // console.log(`[cx]`, d, i);
    return i * 35.2 + 15;
  })
  .attr('cy', (d, i) => {
    // console.log(`[cy]`, d, i);
    return i * 5.2 + 30;
  })
  .attr('opacity', 0.8);

// 基本gタグでくくる

// d3.select("circle:nth-child(2)").style("fill", "orange")

// DOM操作したいならアロー関数で書かない thisにDOMが入ってこない
d3.select('circle:nth-child(4)').on('click', function (e, d) {
  console.log(e, d, this);
});

d3.selectAll('circle').on('click', function (e, d) {
  if (this.classList.contains('selected')) {
    d3.select(this).classed('selected', false);
  } else {
    d3.select(this).classed('selected', true);
  }
  console.log(e, d, this);
});

function handleMouseOver(e, d) {
  // 当たり判定に注意
  tooltipDom.style.top = `${e.pageY + 40}px`;
  tooltipDom.style.left = `${e.pageX + 10}px`;
  tooltipDom.classList.add('is-active');

  d3.select('.tooltip').html(
    `<div class="name"><b>name:</b>${d.name}</div><div class="score"><b>score:<b>${d.score}</div>`
  );

  // console.log(e, d, this, e.pageY, e.pageX);
}
function handleMouseOut(e, d) {
  tooltipDom.classList.remove('is-active');
  // console.log(e, d, this, e.pageY, e.pageX);
}

d3.selectAll('g.item')
  .on('mouseover', handleMouseOver)
  .on('mouseout', handleMouseOut);

d3.select('.checkbox').on('input', function (e, d) {
  console.log(e, d, this);
  if (e.target.checked) {
    console.log('checked!');
  } else {
    console.log('unchecked!');
  }
});

function colorAll(selection) {
  console.log(selection);
  selection.style('fill', 'orange');
}

d3.selectAll('circle').call(colorAll);

d3.selectAll('circle')
  .filter(function (d, i) {
    return i % 2 === 0;
  })
  .style('fill', 'green');

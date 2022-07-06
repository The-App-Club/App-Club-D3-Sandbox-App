import * as d3 from "d3";
// https://www.essycode.com/posts/d3-animation-along-path/

const height = 500;
const width = 860;
const barOffset = 20;

// append the svg object to the body of the page
const svg = d3
  .select(".workspace")
  .append("svg")
  .attr('width', '100%')
  .attr('viewBox', `0 0 ${width + 2 * barOffset} ${height + 2 * barOffset}`);

//Read the data
d3.csv(
  "sample.csv",

  // When reading the csv, I must format variables:
  function (d) {
    return { date: d3.timeParse("%Y-%m-%d")(d.date), value: d.value };
  }
).then(
  // Now I can use this dataset:
  function (data) {
    // Add X axis --> it is a date format
    const x = d3
      .scaleTime()
      .domain(
        d3.extent(data, function (d) {
          return d.date;
        })
      )
      .range([0, width]);

    // Add Y axis
    const y = d3
      .scaleLinear()
      .domain([
        0,
        d3.max(data, function (d) {
          return +d.value;
        }),
      ])
      .range([height, 0]);

    // Add the line
    svg
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 3)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.value);
          })
      );
  }
);
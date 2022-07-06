import {css} from '@emotion/css';
import {useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import {useResizeObserver} from '../hooks/useResizeObserver';

const GeoChart = ({data, property}) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver({ref: wrapperRef});
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    if (!dimensions) {
      return;
    }

    const svg = d3.select(svgRef.current);

    const minProp = d3.min(data.features, function (feature) {
      return feature.properties[property];
    });

    const maxProp = d3.max(data.features, function (feature) {
      return feature.properties[property];
    });

    const colorScale = d3
      .scaleLinear()
      .domain([minProp, maxProp])
      .range(['#ccc', 'red']);

    // projects geo-coordinates on a 2D plane
    const projection = d3
      .geoMercator()
      .fitSize([dimensions.width, dimensions.height], selectedCountry || data)
      .precision(100);

    // takes geojson data,
    // transforms that into the d attribute of a path element
    const pathGenerator = d3.geoPath().projection(projection);

    // render each country
    svg
      .selectAll('.country')
      .data(data.features)
      .join('path')
      .on('click', function (event, feature) {
        const [[x0, y0], [x1, y1]] = d3.geoPath().bounds(feature);
        console.log([x0, y0], [x1, y1]);
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr('class', 'country')
      .transition()
      .attr('fill', (feature) => colorScale(feature.properties[property]))
      .attr('d', (feature) => pathGenerator(feature));

    // render text
    svg
      .selectAll('.label')
      .data([selectedCountry])
      .join('text')
      .attr('class', 'label')
      .text(function (feature) {
        return (
          feature &&
          feature.properties.name +
            ': ' +
            feature.properties[property].toLocaleString()
        );
      })
      .attr('x', 10)
      .attr('y', 25);
  }, [data, dimensions, property, selectedCountry]);

  return (
    <div ref={wrapperRef}>
      <svg
        ref={svgRef}
        className={css`
          width: 100%;
          display: block;
        `}
      ></svg>
    </div>
  );
};

export {GeoChart};

import {useRef, useEffect} from 'react';
import * as d3 from 'd3';
import {css} from '@emotion/css';

const Bebop = ({data}) => {
  const svgDomRef = useRef();
  const graphDomRef = useRef();
  // sorting the data
  data.sort((a, b) => {
    // return b.value - a.value; //desc
    return a.value - b.value; //asc
  });
  useEffect(() => {
    const svg = d3
      .select(svgDomRef.current)
      .attr('width', 500)
      .attr('height', 72)
      .attr('viewBox', `0 -72 ${500} 90`);
    svg
      .selectAll('text')
      .data(data, (d) => {
        return d.key;
      })
      .join(
        function (enter) {
          console.log('[enter]');
          return enter
            .append('text')
            .attr('fill', 'green')
            .attr('x', (d, i) => {
              return i * 72;
            })
            .attr('y', -72)
            .text((d) => d.char)
            .transition()
            .duration(750)
            .ease(d3.easeCubicInOut)
            .attr('y', 0);
        },
        function (update) {
          console.log('[update]');
          return update
            .attr('fill', 'black')
            .attr('y', 0)
            .transition()
            .duration(750)
            .attr('x', (d, i) => {
              return i * 72;
            });
        },
        function (exit) {
          console.log('[exit]');
          return exit
            .attr('fill', 'brown')
            .transition()
            .duration(750)
            .attr('y', 72)
            .remove();
        }
      )
      .attr('class', 'char');
  }, [data]);

  return (
    <div ref={graphDomRef} className={css``}>
      <svg
        ref={svgDomRef}
        className={css`
          width: 100%;
        `}
      ></svg>
    </div>
  );
};

export {Bebop};

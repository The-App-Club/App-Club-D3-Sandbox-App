import {css} from '@emotion/css';
import {useEffect, useRef, useLayoutEffect, useCallback} from 'react';
import * as d3 from 'd3';
import {easeLinear} from 'd3-ease';

const Path = ({color, progress, debugProgress, dataFilePath}) => {
  const stageDomRef = useRef(null);
  const svgDomRef = useRef(null);
  const linkDataRef = useRef(null);
  const pathDomRef = useRef(null);
  const ballDomRef = useRef(null);

  useLayoutEffect(() => {
    fetch(dataFilePath)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const height = 300;
        const width = 300;
        svgDomRef.current = d3
          .select(stageDomRef.current)
          .append('svg')
          .attr('width', `${width}`)
          .attr('height', `${height}`)
          .attr('viewBox', `0 0 ${width} ${height}`);
        linkDataRef.current = d3
          .line()
          .x(function (d) {
            return d.day;
          })
          .y(function (d) {
            return d.rank;
          });
        ballDomRef.current = svgDomRef.current
          .append('circle')
          .attr('r', 11)
          .attr('fill', color(0))
          .attr('opacity', 0);
        pathDomRef.current = svgDomRef.current
          .append('path')
          .attr('d', linkDataRef.current(data.reverse())) // left 2 right
          // .attr('d', linkDataRef.current(data)) // right 2 left
          .style('stroke', 'black')
          .style('stroke-width', 1)
          .style('fill', 'none');
      });
  }, []);

  const transition = useCallback(
    ({t}) => {
      ballDomRef.current
        .transition()
        .ease(easeLinear)
        .attrTween('transform', function (d, i, a) {
          const dom = a[0];
          d3.select(dom).attr('opacity', 1).attr('fill', color(t));
          const node = pathDomRef.current.node();
          const length = node.getTotalLength();
          return () => {
            return seek({t, length, node});
          };
        });
    },
    [color]
  );

  function seek({t, length, node}) {
    const p = node.getPointAtLength((1 - t) * length);
    return 'translate(' + p.x + ',' + p.y + ')';
  }

  useEffect(() => {
    if (ballDomRef.current && pathDomRef.current) {
      transition({t: progress});
    }
  }, [progress, transition]);

  useEffect(() => {
    if (ballDomRef.current && pathDomRef.current) {
      transition({t: debugProgress / 100});
    }
  }, [debugProgress, transition]);

  return (
    <div
      ref={stageDomRef}
      className={css`
        border: 1px solid;
      `}
    ></div>
  );
};

export {Path};

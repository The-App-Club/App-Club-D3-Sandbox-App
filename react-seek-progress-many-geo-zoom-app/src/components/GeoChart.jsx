import {css} from '@emotion/css';
import React, {useRef, useEffect, useState, useCallback, useMemo} from 'react';
import {transform} from 'framer-motion';
import * as d3 from 'd3';
import {interpolatePath} from 'd3-interpolate-path';
import {samples} from 'culori';
import {useResizeObserver} from '../hooks/useResizeObserver';
import {Spacer} from './Spacer';

const width = 300;
const height = 250;

const GeoChart = ({data, property, debugProgress}) => {
  const svgDomRef = useRef();
  const wrapperRef = useRef();
  const stageDomRef = useRef();
  const pathDomRef = useRef();
  const viewDomRef = useRef();
  const geoDomRef = useRef();

  const dimensions = useResizeObserver({ref: wrapperRef});
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [title, setTitle] = useState(null);
  const [sentence, setSentence] = useState(null);

  const minProp = useMemo(() => {
    return d3.min(data.features, function (feature) {
      return feature.properties[property];
    });
  }, [data, property]);

  const maxProp = useMemo(() => {
    return d3.max(data.features, function (feature) {
      return feature.properties[property];
    });
  }, [data, property]);

  const colorScale = useMemo(() => {
    return (value) => {
      // return d3.interpolateBlues(transform([minProp, maxProp], [0, 1])(value));
      return d3.interpolateBlues(
        transform([minProp, maxProp], [0.5, 1])(value)
      );
      // return d3
      //   .scaleLinear()
      //   .domain([minProp, maxProp])
      //   .range(['#2a78c7', '#e95f56'])(value);
    };
  }, [minProp, maxProp]);

  const niceColoring = useCallback(
    ({t, value}) => {
      d3.select(pathDomRef.current)
        .transition()
        .duration(350)
        .attrTween('fill', function (d) {
          return () => {
            return colorScale(value);
          };
        });
    },
    [colorScale]
  );

  const niceMorph = useCallback(({t, dPath1, dPath2}) => {
    d3.select(pathDomRef.current)
      .transition()
      .duration(750)
      .attrTween('d', function () {
        return () => {
          return interpolatePath(dPath1, dPath2)(t);
        };
      });
  }, []);

  // projects geo-coordinates on a 2D plane
  const projector = useCallback(({features, width, height}) => {
    return d3.geoMercator().fitSize([width, height], features).precision(100);
  }, []);

  // takes geojson data,
  // transforms that into the d attribute of a path element
  const pathGenerator = useCallback(
    ({partFeature, allFeatures, width, height}) => {
      // 全体と部分の関係
      return d3.geoPath().projection(
        projector({
          features: allFeatures,
          width: width,
          height: height,
        })
      )(partFeature);
    },
    [projector]
  );

  const zoomInfoList = useMemo(() => {
    const w = dimensions ? dimensions.width : width;
    const h = dimensions ? dimensions.width : height;
    const dataWithscaleInfoList = data.features.map((feature) => {
      return Object.assign({
        ...feature,
        scaleSize: pathGenerator({
          partFeature: feature,
          allFeatures: feature,
          width: w,
          height: h,
        }),
        defaultSize: pathGenerator({
          partFeature: feature,
          allFeatures: data,
          width: w,
          height: h,
        }),
      });
    });
    const resultInfoList = [];
    [...dataWithscaleInfoList].forEach((dataWithscaleInfo) => {
      const pathList = [];
      pathList.push({
        path: dataWithscaleInfo.defaultSize,
        ...dataWithscaleInfo,
      });
      pathList.push({
        path: dataWithscaleInfo.scaleSize,
        ...dataWithscaleInfo,
      });
      pathList.push({
        path: dataWithscaleInfo.defaultSize,
        ...dataWithscaleInfo,
      });
      resultInfoList.push({
        zoomList: pathList,
      });
    });
    return resultInfoList;
  }, [data, pathGenerator, dimensions]);

  const [progressPairs, zoomPairs] = useMemo(() => {
    const zoomList = zoomInfoList
      .map((zoomInfo) => {
        return zoomInfo.zoomList;
      })
      .flat();
    const zoomPairs = d3.pairs(zoomList);
    const nuts = samples(zoomList.length);
    const progressPairs = d3.pairs(nuts);
    return [progressPairs, zoomPairs];
  }, [zoomInfoList]);

  const matcher = useCallback((array = [], value) => {
    const result = array.findIndex((item) => {
      return item[0] <= value && value <= item[1];
    });
    return result;
  }, []);

  useEffect(() => {
    const svgDom = svgDomRef.current;
    const x = 0;
    const y = 0;
    const w = dimensions ? dimensions.width : width;
    const h = dimensions ? dimensions.width : height;
    const viewbox = `${x} ${y} ${w} ${h}`;
    svgDom.setAttribute('viewBox', viewbox);
  }, [dimensions]);

  useEffect(() => {
    const matchIndex = matcher(progressPairs, debugProgress);
    const [zoomStart, zoomEnd] = zoomPairs[matchIndex];
    const progressPair = progressPairs[matchIndex];
    const p = transform(progressPair, [0, 1])(debugProgress);
    niceMorph({t: p, dPath1: zoomStart.path, dPath2: zoomEnd.path});
    niceColoring({t: p, value: zoomStart.properties[property]});
    setTitle(zoomStart.properties.formal_en);
    setSentence(`${property}: ${zoomStart.properties[property]}`);
  }, [
    debugProgress,
    property,
    niceColoring,
    matcher,
    niceMorph,
    progressPairs,
    zoomPairs,
    title,
    sentence,
  ]);

  useEffect(() => {
    if (!dimensions) {
      return;
    }
    // render each country
    d3.select(geoDomRef.current)
      .selectAll('.country')
      .data(() => {
        return data.features;
      })
      .join('path')
      .on('click', function (event, feature) {
        setSelectedCountry(selectedCountry === feature ? null : feature);
      })
      .attr('class', 'country')
      .transition()
      .attr('fill', (feature) => {
        return colorScale(feature.properties[property]);
      })
      .attr('d', (feature) => {
        return pathGenerator({
          partFeature: feature,
          allFeatures: selectedCountry || data,
          width: dimensions.width,
          height: dimensions.height,
        });
      });
  }, [data, dimensions, property, selectedCountry, colorScale, pathGenerator]);

  return (
    <>
      <h2>{title}</h2>
      {[...Array(1).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <p>{sentence}</p>
      {[...Array(2).keys()].map((n, index) => {
        return <Spacer key={index} />;
      })}
      <div
        ref={wrapperRef}
        className={css`
          width: 100%;
          padding: 0 30px;
        `}
      >
        <svg
          ref={svgDomRef}
          className={css`
            width: 100%;
            display: block;
            border: 1px solid;
            position: relative;
          `}
        >
          <g ref={viewDomRef}>
            <g ref={geoDomRef}></g>
          </g>
          <g ref={stageDomRef}>
            <path ref={pathDomRef} stroke="red" />
          </g>
        </svg>
      </div>
    </>
  );
};

export {GeoChart};

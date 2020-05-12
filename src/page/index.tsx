import React, { useEffect } from 'react';
import G6, { Graph } from '@antv/g6';
import { getAllObject } from '../util';

const Main = () => {
    const ref = React.useRef(null);
    let graph: Graph | null = null;

    useEffect(() => {
      if(!graph) {
        graph = new G6.Graph({
          container: ref.current as any,
          width: 2000,
          height: 1500,
          defaultNode: {
            shape: 'node',
            labelCfg: {
              style: {
                fill: '#000000A6',
                fontSize: 10
              }
            },
            style: {
              stroke: '#72CC4A',
              width: 150
            }
          },
          layout: {
            type: 'radial',
            center: [ 900, 700 ],     // 可选，默认为图的中心
            linkDistance: 300,         // 可选，边长
            maxIteration: 1000,       // 可选
            focusNode: 'node11',      // 可选
            unitRadius: 100,          // 可选
            preventOverlap: true,     // 可选，必须配合 nodeSize
            nodeSize: 100,             // 可选
            strictRadial: false,      // 可选
            workerEnabled: true       // 可选，开启 web-worker
          },
          modes: {
            default: ['drag-canvas', 'drag-node'],
          },
          animate: true,
        })
      }
      const data = getAllObject();
      graph!.data(data);

      graph!.render();

    }, []);

    return (
      <>
        <div ref={ref} style={{ marginTop: 200 }}></div>
      </>
    );
}

export default Main;

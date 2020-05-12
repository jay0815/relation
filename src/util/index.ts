export const getAllObject = () => {
  const set = new Set();
  const globalProperties = [
      'eval',
      'isFinite',
      'isNaN',
      'parseFloat',
      'parseInt',
      'decodeURI',
      'decodeURIComponent',
      'encodeURI',
      'encodeURIComponent',
      'Array',
      'Date',
      'RegExp',
      'Promise',
      'Proxy',
      'Map',
      'WeakMap',
      'Set',
      'WeakSet',
      'Function',
      'Boolean',
      'String',
      'Number',
      'Symbol',
      'Object',
      'Error',
      'EvalError',
      'RangeError',
      'ReferenceError',
      'SyntaxError',
      'TypeError',
      'URIError',
      'ArrayBuffer',
      'SharedArrayBuffer',
      'DataView',
      'Float32Array',
      'Float64Array',
      'Int8Array',
      'Int16Array',
      'Int32Array',
      'Uint8Array',
      'Uint16Array',
      'Uint32Array',
      'Uint8ClampedArray',
      'Atomics',
      'JSON',
      'Math',
      'Reflect'
    ];

  const quene: Array<{
    path: string[],
    object: any
  }> = [];
  const data:Array<{
    source: number,
    id: number,
    label: string
  }> = [];
  const indexMap = new Map<string, number>();
  for(var p of globalProperties){
    quene.push({
      path: [p],
      object: (window as any)[p],

    })
    data.push({
      source: 0,
      id: data.length+1,
      label: p
    });
    indexMap.set(
      p,
      data.length
    );
  };


  let current;
  while (quene.length) {
    current = quene.shift() as any;
    if(!set.has(current.object)){
      set.add(current.object);
      // console.log(current.object)
      for(let p of Object.getOwnPropertyNames(current!.object)){
        var property = Object.getOwnPropertyDescriptor(current!.object, p)! as any;
        // console.log(current.path)
        const path = current.path;
        const source = indexMap.get(
          path.join('.')
        )!;

        if(
          property.hasOwnProperty('value') && ((property.value !== null &&
            typeof property.value === 'object') || typeof property.value === 'object'
          ) && property.value instanceof Object
        ){
          quene.push({
            path: path.concat([p]),
            object: property.value
          });

          data.push({
            source: source,
            id: data.length+1,
            label: path.concat([p]).join('.')
          });

          if(!indexMap.has(path.concat([p]).join('.'))){
            indexMap.set(path.concat([p]).join('.'), indexMap.size+1)
          }

        }
        if(property.hasOwnProperty('get') && typeof property.get === 'function'){
          quene.push({
            path: current.path.concat([p]),
            object: property.get
          })

          data.push({
            source: source,
            id: data.length+1,
            label: path.concat([p, 'get']).join('.')
          });

          if(!indexMap.has(path.concat([p, 'get']).join('.'))){
            indexMap.set(path.concat([p, 'get']).join('.'), indexMap.size+1)
          }
        }
        if(property.hasOwnProperty('set') && typeof property.set === 'function'){
          quene.push({
            path: current.path.concat([p, 'set']),
            object: property.set
          })

          data.push({
            source: source,
            id: data.length+1,
            label: path.concat([p, 'set']).join('.')
          });

          if(!indexMap.has(path.concat([p, 'set']).join('.'))){
            indexMap.set(path.concat([p, 'set']).join('.'), indexMap.size+1)
          }
        }

      }
    }
  }
  // console.log(set, data, indexMap)
  const nodes: Array<{
    id: string,
    label: string,
  }> = [{
    id: '0',
    label: 'null'
  }];
  const edges: Array<{
    source: string,
    target: string,
  }> = [];
  data.map((i) => {
    nodes.push({
      id: i.id+'',
      label: i.label
    });
    edges.push({
      source: i.source+'',
      target: i.id+''
    })
  })
  return {
    nodes, edges
  }
}

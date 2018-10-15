const NODES_COORDINATES = {};

const createSigma = (container, settings = {}) => {
  const defaultSettings = {
    minArrowSize: 6
  };
  return new sigma({
    renderer: {
      container,
      type: "canvas"
    },
    settings: Object.assign(defaultSettings, settings)
  });
};

const addTemplateToGraph = (container, template, options) => {
  const { index, color } = options;
  const { x, y } = template.foglet.overlay("tman").network.descriptor;
  container.graph.addNode({
    id: template.foglet.inViewID,
    label: `${index}(${x},${y})`,
    x,
    y,
    size: 3,
    color
  });
};

const addEdge = (container, source, target) => {
  container.graph.addEdge({
    id: source + "-" + target,
    source,
    target,
    type: "curvedArrow"
  });
  container.refresh();
};

const dropEdge = (container, id) => {
  container.graph.dropEdge(id);
  container.refresh();
};

const randomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 3; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const updateNode = (container, id, data) => {
  const { x, y } = data;
  const node = container.graph.nodes(id);
  node.x = x;
  node.y = y;
  container.refresh();
};

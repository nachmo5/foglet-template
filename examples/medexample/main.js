console.log(template); // eslint-disable-line
// the bundle is included by default in the browser you do not have to require/import it
localStorage.debug = ""; // 'template'

// Create sigma graphs _________
const rps = createSigma("rps");
const overlay = createSigma("overlay");
// Creating peers and sigma nodes
const max = 3;
const peers = [];
for (let i = 0; i < max; i++) {
  const fogletTemplate = new template(undefined, true);
  peers.push(fogletTemplate);
  // Add nodes to graph
  const options = {
    color: randomColor(),
    index: i
  };
  addTemplateToGraph(rps, fogletTemplate, options);
  addTemplateToGraph(overlay, fogletTemplate, options);
  // Adding listeners
  const fgId = fogletTemplate.foglet.inViewID;
  fogletTemplate.on("rps-open", id => addEdge(rps, fgId, id));
  fogletTemplate.on("overlay-open", id => addEdge(overlay, fgId, id));
  fogletTemplate.on("rps-close", id => dropEdge(rps, `${fgId}-${id}`));
  fogletTemplate.on("overlay-close", id => dropEdge(overlay, `${fgId}-${id}`));
  fogletTemplate.on("descriptor-updated", ({ id, descriptor }) => {
    updateNode(rps, id, descriptor);
    updateNode(overlay, id, descriptor);
  });
}

// Connect random peers with each others
forEachAsync(peers, (peer, index) => {
  let rn = index;
  while (rn == index) {
    rn = Math.floor(Math.random() * peers.length);
  }
  const randomPeer = peers[rn];
  return peer.connection(randomPeer);
}).then(() => {
  rps.refresh();
  overlay.refresh();
  // Set broadcast listeners
  setListeners();
  // Firing change location loop
  updateLocation(peers);
});

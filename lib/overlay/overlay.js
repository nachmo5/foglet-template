const TMAN = require("./abstract");
const debug = require("debug")("template:overlay");

module.exports = class Overlay extends TMAN {
  constructor(...Args) {
    super(...Args);
    debug("Overlay initialized");
    this.rps._partialViewSize = () => this.options.maxPeers;
  }

  /**
   * Gives the start descriptor used by the TMan overlay (can be an empty object).
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {Object} The start descriptor used by the TMan overlay
   */
  _startDescriptor() {
    let x = Math.floor(Math.random() * 8);
    let y = Math.floor(Math.random() * 8);
    while(NODES_COORDINATES[[`${x}${y}`]]){
     x = Math.floor(Math.random() * 8);
     y = Math.floor(Math.random() * 8);
    }
    NODES_COORDINATES[[`${x}${y}`]] = true;
    return { x, y };
  }

  /**
   * Give the delay **in milliseconds** after which the descriptor must be recomputed.
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @return {number} The delay **in milliseconds** after which the descriptor must be recomputed
   */
  _descriptorTimeout() {
    return 3 * 1000;
  }

  /**
   * Compare two peers and rank them according to a ranking function.
   * This function must return `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB`.
   *
   * Subclasses of {@link TManOverlay} **must** implement this method.
   * @param {*} neighbour - The neighbour to rank with
   * @param {Object} descriptorA - Descriptor of the first peer
   * @param {Object} descriptorB - Descriptor of the second peer
   * @param {TManOverlay} peerA - (optional) The overlay of the first peer
   * @param {TManOverlay} peerB - (optional) The overlay of the second peer
   * @return {integer} `0 if peerA == peerB`, `1 if peerA < peerB` and `-1 if peerA > peerB` (according to the ranking algorithm)
   */
  _rankPeers(neighbour, descriptorA, descriptorB, peerA, peerB) {
    const getDistance = (descriptor1, descriptor2) => {
      const { x: xa, y: ya } = descriptor1;
      const { x: xb, y: yb } = descriptor2;
      const dx = xa - xb;
      const dy = ya - yb;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const distanceA = getDistance(neighbour.descriptor, descriptorA);
    const distanceB = getDistance(neighbour.descriptor, descriptorB);

    return distanceA > distanceB ? 1 : distanceA == distanceB ? 0 : -1;
  }
};

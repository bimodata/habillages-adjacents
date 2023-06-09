
import { createLinksAndComputeStatsForOneCsc } from "./createLinksAndComputeStats";

export default function getMermaidStringForCsc(csc) {
  if (!csc.linkByLinkKey) {
    createLinksAndComputeStatsForOneCsc(csc);
  }
  return getMermaidString(csc.linkByLinkKey, Array.from(csc.allAdjacentCscs));
}








/**
 * 
 * @param {Map} linkByLinkKey 
 */
function getMermaidString(linkByLinkKey, cscs) {
  const links = Array.from(linkByLinkKey.values());

  return `graph TD
${classesDefString}
${getNodesString(cscs)}
${getLinksString(links)}
${legendString}
${getLinkStyleString(links)}
`
}

function getNodesString(cscs) {
  return cscs.map((csc) => {
    return `${csc.shortKey}[${csc.cscKey}<br>`
      + `${csc.cscSchedUnit} ${csc.cscServiceCtxId ? ` _________ ${csc.cscServiceCtxId}` : ''}<br>`
      + `${csc.dateAsDate.toLocaleDateString()} ${csc.dateAsDate.toLocaleTimeString()} ${csc.cscUserStamp}]:::${getClassNameOfCsc(csc)}`
  }).join('\n')
}

function getLinksString(links) {
  return links.map(({ from, to, isBidirectional }) => {
    const arrowString = isBidirectional ? '---' : '-->';
    return `${from.shortKey} ${arrowString} ${to.shortKey}`
  }).join('\n');
}

function getClassNameOfCsc(csc) {
  const letter = csc.cscBooking.slice(0, 1);
  return classStyleByClassName[letter] ? letter : 'Z';
}

function getLinkStyleString(links) {
  if (links.length === 0) return '';
  const singleLinkIndexes = [];
  const biDirLinkIndexes = [];
  links.forEach((link, index) => {
    if (link.isBidirectional) {
      biDirLinkIndexes.push(index);
    }
    else {
      singleLinkIndexes.push(index);
    }
  });
  const linkStyleLines = [
    (singleLinkIndexes.length === 0 ? false : `linkStyle ${singleLinkIndexes} stroke-width:3px,stroke:#000000,color:black;`),
    (biDirLinkIndexes.length === 0 ? false : `linkStyle ${biDirLinkIndexes} stroke-width:6px,stroke:#022992,color:black;`),
    `linkStyle default stroke-width:0px`
  ]
  return linkStyleLines.filter(Boolean).join('\n');
}

const classStyleByClassName = {
  B: `fill:#e6194B,color:#FFFFFF,stroke:none;`,
  C: `fill:#3cb44b,color:#FFFFFF,stroke:none;`,
  D: `fill:#ffe119,color:#000000,stroke:none;`,
  F: `fill:#4363d8,color:#FFFFFF,stroke:none;`,
  G: `fill:#f58231,color:#FFFFFF,stroke:none;`,
  J: `fill:#911eb4,color:#FFFFFF,stroke:none;`,
  K: `fill:#42d4f4,color:#000000,stroke:none;`,
  L: `fill:#f032e6,color:#FFFFFF,stroke:none;`,
  M: `fill:#bfef45,color:#000000,stroke:none;`,
  R: `fill:#fabed4,color:#000000,stroke:none;`,
  S: `fill:#469990,color:#FFFFFF,stroke:none;`,
  T: `fill:#dcbeff,color:#000000,stroke:none;`,
  U: `fill:#9A6324,color:#FFFFFF,stroke:none;`,
  Z: `fill:#000000,color:#FFFFFF,stroke:none;`
};

const legendTextByClassName = {
  B: `NAQ`,
  C: `IC`,
  D: `BFC`,
  F: `LEX`,
  G: `PDL`,
  J: `BZH`,
  K: `AURA`,
  L: `HDF`,
  M: `SUD`,
  R: `NMD`,
  S: `GE`,
  T: `OCC`,
  U: `CVDL`,
  Z: `Autre`
}

function getClassesDefString() {
  return Object.entries(classStyleByClassName).map(([className, classStyle,]) => `classDef ${className} ${classStyle}`).join('\n');
}

const classesDefString = getClassesDefString();

function getLegendString() {
  return Object.entries(legendTextByClassName).map(([className, legendText]) => `${legendText}[${legendText}]:::${className}`).join('\n') +
    `
subgraph Légende
direction TB
NAQ---IC---BFC---LEX---GE---OCC---CVDL
PDL---BZH---AURA---HDF---SUD---NMD---Autre
end`
}
const legendString = getLegendString();
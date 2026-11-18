export const SECTOR_1_DATA = {
  id: 'sector-1',
  name: 'Central Coimbatore',
  landmarks: [
    { id: 'gandhipuram', name: 'Gandhipuram Flyover & Bus Terminus', x: 0, z: -140, color: '#ff47b6', radius: 95 },
    { id: 'brookefields', name: 'Brookefields Mall & Brooke Bond Rd', x: -170, z: -60, color: '#00f0ff', radius: 85 },
    { id: 'rspuram', name: 'RS Puram DB Road & Shopping District', x: -230, z: 70, color: '#ffe600', radius: 95 },
    { id: 'vocpark', name: 'VOC Park & Zoo Grounds', x: 110, z: -20, color: '#39ff14', radius: 85 },
    { id: 'junction', name: 'Coimbatore Junction & Town Hall', x: -50, z: 140, color: '#ff9100', radius: 85 },
    { id: 'avinashi', name: 'Avinashi Road IT Corridor', x: 240, z: -130, color: '#00f0ff', radius: 100 },
    { id: 'ukkadam', name: 'Ukkadam Periyakulam Lakefront', x: -40, z: 330, color: '#00bfff', radius: 130 }
  ],
  futureSectors: [
    { name: 'SECTOR 2: PEELAMEDU & AIRPORT [LOCKED]', x: 460, z: -180 },
    { name: 'SECTOR 3: RACE COURSE [LOCKED]', x: 260, z: 120 },
    { name: 'SECTOR 4: MARUDHAMALAI HILLS [LOCKED]', x: -460, z: -220 },
    { name: 'SECTOR 5: SINGANALLUR LAKE [LOCKED]', x: 440, z: 260 }
  ],
  roads: [
    { x1: -550, z1: -130, x2: 550, z2: -130, width: 26, name: 'Avinashi Road' },
    { x1: 0, z1: -520, x2: 0, z2: 240, width: 24, name: 'Cross Cut Road' },
    { x1: -170, z1: -450, x2: -170, z2: 220, width: 20, name: 'Brooke Bond Road' },
    { x1: -280, z1: -260, x2: -280, z2: 240, width: 20, name: 'Diwan Bahadur (DB) Road' },
    { x1: -420, z1: 140, x2: 520, z2: 140, width: 24, name: 'Trichy Road' },
    { x1: -320, z1: 250, x2: 320, z2: 250, width: 22, name: 'Ukkadam Lake Bund Rd' },
    { x1: -320, z1: 420, x2: 320, z2: 420, width: 20, name: 'Periyakulam South Bypass' },
    { x1: -350, z1: -20, x2: 380, z2: -20, width: 18, name: 'VOC Park Road' },
    { x1: 180, z1: -450, x2: 180, z2: 250, width: 20, name: 'Nava India / Race Course Link' }
  ],
  raceRoute: [
    { x: 0, z: -130, label: 'Gandhipuram Signal' },
    { x: 240, z: -130, label: 'Avinashi Road Flyover' },
    { x: 180, z: 140, label: 'Trichy Road Junction' },
    { x: -50, z: 250, label: 'Ukkadam Lake Bund' },
    { x: -280, z: 140, label: 'RS Puram DB Road' },
    { x: -170, z: -130, label: 'Brookefields Finish' }
  ]
};

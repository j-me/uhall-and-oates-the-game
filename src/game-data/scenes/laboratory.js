/**
 * Demo scene. Hotspot bounds are percentages: { left, top, width, height }.
 * Add `requires`, `effects`, `dialogue`, or `onUse` fields as the story grows.
 */
export const laboratory = {
  id: 'laboratory',
  name: 'The Clockwork Laboratory',
  caption: 'A temporary scene with very permanent-looking dust.',
  artClass: 'demo-lab',
  hotspots: [
    {
      id: 'time-machine', label: 'time machine', bounds: { left: 60, top: 16, width: 25, height: 67 },
      responses: {
        look: 'A seriously overqualified toaster with a clock face.',
        talk: 'The machine replies with a noise that means either “hello” or “evacuate.”',
        use: 'It needs a story before it needs a button.',
      },
    },
    {
      id: 'desk', label: 'work desk', bounds: { left: 13, top: 51, width: 29, height: 30 },
      responses: {
        look: 'A desk with the precise amount of clutter required by fictional scientists.',
        talk: 'The desk listens patiently. It has tenure.',
        use: 'You shuffle papers, but no plot-relevant documents volunteer themselves.',
      },
    },
    {
      id: 'goggles', label: 'safety goggles', bounds: { left: 28, top: 56, width: 8, height: 9 },
      item: { id: 'goggles', label: 'safety goggles', icon: '◉' },
      responses: {
        look: 'Stylish, protective, and exactly the right size for a protagonist.',
        take: 'You acquire the safety goggles. Your eyebrows are grateful.',
      },
    },
  ],
};

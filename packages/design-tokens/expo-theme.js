export const expoTheme = Object.freeze({
  color: Object.freeze({
    navy: "#17355F",
    blue: "#2376A8",
    teal: "#148A7B",
    amber: "#D9921E",
    ink: "#1D2A36",
    muted: "#5E6C78",
    paper: "#F4F1E8",
    surface: "#FFFFFF",
    border: "#D8DFE5",
    danger: "#B74343",
    focus: "#F2B84B",
  }),
  font: Object.freeze({ display: "serif", body: "system", mono: "monospace" }),
  space: Object.freeze({ 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 }),
  radius: Object.freeze({ small: 6, medium: 12, large: 20, pill: 999 }),
  motion: Object.freeze({ fast: 120, normal: 220, slow: 360 }),
});

export default expoTheme;

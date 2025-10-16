export function abbreviateForStrip(t){ const [h]=String(t).split(";"); return h.replace(".V1","").replace(".V","v"); }

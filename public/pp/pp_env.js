export const SUPA_URL = 'https://ghjlzrmuugquumqwlqgl.supabase.co';
export const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoamx6cm11dWdxdXVtcXdscWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzI5MDksImV4cCI6MjA2NDI0ODkwOX0.4obVbXotkoG4HFf_meYbSOn5PAqgFsb2KXrEQoMNPEs';
export async function supa(path){ const r=await fetch(`${SUPA_URL}/rest/v1/${path}`,{headers:{apikey:SUPA_ANON,Authorization:`Bearer ${SUPA_ANON}`}}); if(!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); }
export function el(t,a={},c=[]){const e=document.createElement(t); for(const[k,v] of Object.entries(a)){k==='class'?e.className=v:k==='style'&&v&&typeof v==='object'?Object.assign(e.style,v):v!=null&&e.setAttribute(k,v)}; (c||[]).forEach(x=>e.append(x)); return e;}

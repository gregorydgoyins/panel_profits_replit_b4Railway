const URL='https://ghjlzrmuugquumqwlqgl.supabase.co';
const ANON='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdoamx6cm11dWdxdXVtcXdscWdsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg2NzI5MDksImV4cCI6MjA2NDI0ODkwOX0.4obVbXotkoG4HFf_meYbSOn5PAqgFsb2KXrEQoMNPEs';
function qs(s){return document.querySelector(s)}function el(t,a={},c=[]){const e=document.createElement(t);for(const[k,v]of Object.entries(a)){k==="class"?e.className=v:k==="style"&&v&&typeof v==="object"?Object.assign(e.style,v):v!=null&&e.setAttribute(k,v)};c.forEach(x=>e.append(x));return e}
function findMount(){const c=["#news-ticker","[data-widget='news-ticker']", ".news-strip","#topNews","#news"];for(const k of c){const n=qs(k);if(n&&n.parentElement){const s=el("div",{id:"pp-news-slot"});n.parentElement.insertBefore(s,n.nextSibling);return s}}const s=el("div",{id:"pp-news-slot"});document.body.append(s);return s}
async function fetchHeadlines(){const u=`${URL}/rest/v1/rss_items?select=title,source,published_at,url&order=published_at.desc&limit=20`;const r=await fetch(u,{headers:{apikey:ANON,Authorization:`Bearer ${ANON}`}});if(!r.ok)throw new Error(`HTTP ${r.status}`);return r.json()}
function render(root,rows){const style=el("style",{},[`
 #pp-news-slot{margin:6px 0}.pp-news{position:relative;overflow:hidden;border-radius:8px;background:rgba(0,0,0,.35);backdrop-filter:saturate(1.2) blur(2px)}
 .pp-track{display:inline-block;white-space:nowrap;padding:8px;animation:pp-scroll 45s linear infinite}
 .pp-item{margin-right:28px;color:#fff;font:13px/1.2 system-ui,-apple-system,Segoe UI,Roboto,Arial;opacity:.95}
 .pp-item a{color:#fff;text-decoration:none}.pp-item a:hover{text-decoration:underline}
 @keyframes pp-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`]);
 const wrap=el("div",{class:"pp-news"}), track=el("div",{class:"pp-track"});
 const items=rows.map(r=>{const text=`${(r.source||'News')} — ${r.title||''}`.trim(); return el("span",{class:"pp-item"},[el("a",{href:r.url||"#",target:"_blank",rel:"noopener"},[text])])});
 [...items,...items].forEach(i=>track.append(i)); wrap.append(track); root.append(style,wrap)}
async function boot(){try{const root=findMount();const rows=await fetchHeadlines();if(!rows?.length){console.log("pp-news: no headlines");return}render(root,rows)}catch(e){console.error("pp-news error:",e)}}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot); else boot();

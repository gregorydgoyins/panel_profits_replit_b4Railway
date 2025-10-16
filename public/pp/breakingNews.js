import { supa, el } from "./pp_env.js";

function findMount(){
  const ids=["#breaking-news","#news-ticker","#news","#topNews"];
  for(const i of ids){ const n=document.querySelector(i); if(n&&n.parentElement){const slot=el("div",{id:"pp-breaking-slot"}); n.parentElement.insertBefore(slot,n.nextSibling); return slot;}}
  const slot=el("div",{id:"pp-breaking-slot"}); document.body.append(slot); return slot;
}
async function loadItems(){
  const [rss,pods,vids]=await Promise.allSettled([
    supa('rss_items?select=title,url,source,published_at&order=published_at.desc&limit=30'),
    supa('audio_items?select=title,url,source,published_at&order=published_at.desc&limit=20'),
    supa('video_items?select=title,url,channel,published_at&order=published_at.desc&limit=20')
  ]);
  const A=rss.value||[];
  const B=(pods.status==='fulfilled'?pods.value:[]).map(x=>({title:x.title,url:x.url,source:x.source||'Podcast'}));
  const C=(vids.status==='fulfilled'?vids.value:[]).map(x=>({title:x.title,url:x.url,source:x.channel||'YouTube'}));
  return [...A,...B,...C].filter(x=>x&&(x.title||x.url));
}
function render(root,rows){
  const css=el("style",{},[`
    #pp-breaking-slot{margin:6px 0}
    .pp-newsbar{overflow:hidden;border-radius:10px;background:rgba(0,0,0,.40);backdrop-filter:saturate(1.2) blur(4px)}
    .pp-head{padding:6px 10px;font:12px/1.2 system-ui,-apple-system,Segoe UI,Roboto;color:#fff;opacity:.85}
    .pp-title{font-weight:600;margin-right:8px}
    .pp-track{display:inline-block;white-space:nowrap;padding:8px 10px;animation:pp-scroll 45s linear infinite}
    .pp-item{margin-right:28px}.pp-item a{color:#fff;text-decoration:none}.pp-item a:hover{text-decoration:underline}
    @keyframes pp-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}`]);
  const wrap=el("div",{class:"pp-newsbar"}); const head=el("div",{class:"pp-head"},[el("span",{class:"pp-title"},["Breaking News"])]);
  const track=el("div",{class:"pp-track"});
  const items=rows.map(r=>el("span",{class:"pp-item"},[el("a",{href:r.url||"#",target:"_blank",rel:"noopener"},[`${(r.source||'News')} — ${r.title||''}`])]));
  [...items,...items].forEach(i=>track.append(i)); wrap.append(head,track); root.append(css,wrap);
}
async function boot(){ const root=findMount(); const rows=await loadItems(); if(rows.length) render(root,rows); }
if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",boot); else boot();

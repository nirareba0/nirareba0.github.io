// 文言の編集モード
//   index.html?edit で開くと、見出し・本文・ボタンの字をその場で直せる。
//   直した内容はこのブラウザにだけ残る（localStorage）。公開されるのは「HTML を書き出す」で保存した index.html を
//   サイトのフォルダに置き換えたときだけ。「変更点をコピー」は AI に渡す用の一覧。
(()=>{'use strict';
const KEY='taido-edits-v1';
const SEL='h1,h2,h3,p,li:not(:has(p,h3)),dt,dd,summary,.cta,.more,.work-name,.work-kind,.site-header nav span,.en,.t';
const editing=/[?&#]edit\b/.test(location.search+location.hash);
const load=()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {}}};
const save=o=>{try{localStorage.setItem(KEY,JSON.stringify(o))}catch(e){}};
const targets=root=>[...root.querySelectorAll(SEL)].filter(el=>!el.closest('.edit-bar,.edit-badge,svg,.sprite')&&!el.querySelector(SEL));
const label=el=>{const s=el.closest('section,header,footer');return (s&&(s.id||s.className.split(' ')[0])||'page')+' / '+el.tagName.toLowerCase()};

const els=targets(document);
els.forEach((el,i)=>el.dataset.ek=i);
const originals={};els.forEach(el=>originals[el.dataset.ek]=el.innerHTML);
let edits=load();
// 見出しの打ち込みの動きがあると innerHTML が変わるので、動きの前の字を元にする
Object.entries(edits).forEach(([k,v])=>{const el=els[k];if(el&&originals[k]!==v){el.innerHTML=v;el.classList.add('edited')}});
const count=()=>Object.keys(edits).filter(k=>els[k]&&edits[k]!==originals[k]).length;

if(!editing){
  if(count()){const a=document.createElement('a');a.className='edit-badge';a.href='?edit';a.textContent=`このブラウザで直した ${count()} か所を表示中（まだ公開されていません）`;document.body.appendChild(a)}
  return;
}

els.forEach(el=>{
  el.contentEditable='true';el.spellcheck=false;
  el.addEventListener('input',()=>{edits[el.dataset.ek]=el.innerHTML;el.classList.toggle('edited',el.innerHTML!==originals[el.dataset.ek]);save(edits);upd()});
  el.addEventListener('click',e=>{if(el.closest('a'))e.preventDefault()});
  el.addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey&&!/^(P|LI|DD)$/.test(el.tagName)){e.preventDefault();el.blur()}});
});
document.addEventListener('click',e=>{const a=e.target.closest('a');if(a&&!e.target.closest('.edit-bar'))e.preventDefault()},true);
document.querySelectorAll('details').forEach(d=>d.open=true);
document.querySelectorAll('summary').forEach(sm=>sm.addEventListener('click',ev=>ev.preventDefault()));

const bar=document.createElement('div');bar.className='edit-bar';bar.setAttribute('role','region');bar.setAttribute('aria-label','編集モード');
bar.innerHTML='<span>編集モード <b class="n"></b></span><button type="button" data-act="copy">変更点をコピー</button><button type="button" data-act="export">HTML を書き出す</button><button type="button" class="ghost" data-act="reset">全部もとに戻す</button><button type="button" class="ghost" data-act="exit">編集をやめる</button><span class="hint">字をクリックして直す。改行は Shift+Enter。直した所は青く表示。保存はこのブラウザだけ。公開するには「HTML を書き出す」で保存した index.html をサイトのフォルダに置き換えるか、AI に渡す。</span>';
document.body.appendChild(bar);
const upd=()=>bar.querySelector('.n').textContent=`${count()} か所を直した`;upd();
const strip=s=>s.replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim();

bar.addEventListener('click',async e=>{
  const act=e.target.dataset.act;if(!act)return;
  if(act==='copy'){
    const lines=Object.keys(edits).filter(k=>els[k]&&edits[k]!==originals[k]).map(k=>`【${label(els[k])}】\n  前: ${strip(originals[k])}\n  後: ${strip(edits[k])}`);
    const text=lines.length?`たいどのサイトの文言を次のように直したい（${lines.length}か所）\n\n`+lines.join('\n\n'):'直した所はまだありません';
    try{await navigator.clipboard.writeText(text);e.target.textContent='コピーしました'}catch(err){prompt('この内容をコピーしてください',text)}
    setTimeout(()=>e.target.textContent='変更点をコピー',1600);
  }
  if(act==='export'){
    let src;
    try{const r=await fetch(location.pathname,{cache:'no-store'});src=await r.text()}catch(err){alertMsg('書き出しには、サイトをローカルのサーバーで開いてください（file:// では読めません）');return}
    const doc=new DOMParser().parseFromString(src,'text/html');
    const t=targets(doc);
    Object.entries(edits).forEach(([k,v])=>{if(t[k]&&els[k]&&v!==originals[k])t[k].innerHTML=v});
    const html='<!doctype html>\n'+doc.documentElement.outerHTML+'\n';
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download='index.html';a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  if(act==='reset'){
    if(!count())return;
    edits={};save(edits);els.forEach(el=>{el.innerHTML=originals[el.dataset.ek];el.classList.remove('edited')});upd();
  }
  if(act==='exit'){location.href=location.pathname+location.hash.replace(/#?edit/,'')}
});
function alertMsg(m){const h=bar.querySelector('.hint');h.textContent=m;h.style.color='#ffb4a6'}
})();

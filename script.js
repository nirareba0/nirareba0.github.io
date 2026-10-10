(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const editing=/[?&#]edit\b/.test(location.search+location.hash);

// 見出しが打ち込まれる動き（iroawase の型）。編集モードと「動きを減らす」設定では出さない
const h=document.querySelector('[data-type]');
if(h&&!reduce&&!editing){
  h.setAttribute('aria-label',h.textContent.replace(/\s+/g,''));
  const chars=[];
  const wrap=node=>{[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){const f=document.createDocumentFragment();[...n.textContent].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;s.setAttribute('aria-hidden','true');f.appendChild(s);chars.push(s)});n.replaceWith(f)}
    else if(n.nodeType===1)wrap(n)})};
  wrap(h);h.classList.add('typing');
  const caret=document.createElement('span');caret.className='caret';caret.setAttribute('aria-hidden','true');
  let i=0;const tick=()=>{if(i<chars.length){chars[i].classList.add('on');chars[i].after(caret);i++;setTimeout(tick,chars[i-1].textContent==='、'?380:150)}};
  setTimeout(tick,400);
}
})();

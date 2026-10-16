(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const editing=/[?&#]edit\b/.test(location.search+location.hash);
const animate=!reduce&&!editing;
const root=document.documentElement;
if(animate)root.classList.add('anim');

// 線のアイコンを <use> から中身に置き換える（線を1本ずつ描くため）
document.querySelectorAll('svg.ic').forEach(svg=>{
  const use=svg.querySelector('use');if(!use)return;
  const sym=document.querySelector(use.getAttribute('href'));if(!sym)return;
  svg.setAttribute('viewBox',sym.getAttribute('viewBox'));
  sym.querySelectorAll('path').forEach(p=>{const c=p.cloneNode(true);c.setAttribute('pathLength','1');svg.appendChild(c)});
  use.remove();
});

// 公式LINE：body の data-line-url（友だち追加 URL）を使う。REPLACE-ME のあいだは準備中
const lineUrl=document.body.dataset.lineUrl||'';
const linePending=!lineUrl||/REPLACE-ME/.test(lineUrl);
const toast=msg=>{let t=document.querySelector('.toast');if(!t){t=document.createElement('p');t.className='toast';t.setAttribute('role','status');document.body.appendChild(t)}t.textContent=msg;t.classList.add('on');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('on'),2600)};
window.taidoLine=root=>(root||document).querySelectorAll('a[data-line]').forEach(a=>{
  if(!a.getAttribute('href')||/REPLACE-ME/.test(a.getAttribute('href')))a.href=lineUrl||'#';
  if(linePending&&!a.dataset.bound){a.dataset.bound='1';a.addEventListener('click',e=>{if(editing)return;e.preventDefault();toast('公式LINEは準備中です。いまはフォームからどうぞ。')})}
});
window.taidoLine(document);

// 数を数える（2026-10-10 本人が B を選んだ）：body の data-count に GoatCounter の URL があるときだけ。
// cookie を使わず、個人を特定しない。数えるのは、ページの表示・チェックの開始と完了・LINE とフォームのボタンだけ。回答は送らない
const countUrl=document.body.dataset.count||'',gcq=[];
window.taidoCount=name=>{if(!countUrl||editing)return;const gc=window.goatcounter;gc&&gc.count?gc.count({path:name,title:name,event:true}):gcq.push(name)};
if(countUrl&&!editing){const s=document.createElement('script');s.async=true;s.src='https://gc.zgo.at/count.js';s.dataset.goatcounter=countUrl;s.onload=()=>gcq.splice(0).forEach(window.taidoCount);document.head.appendChild(s)}
document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const inResult=!!a.closest('#diag');
  if(a.matches('[data-line]'))window.taidoCount(inResult?'result-line':'line');
  else if(/docs\.google\.com\/forms/.test(a.href))window.taidoCount(inResult?'result-form':'form')});

// スマホの画面の下に、意識度チェックと LINE の固定ボタン（編集モードでは出さない）
if(!editing&&!document.body.classList.contains('page-diag')){
  const bar=document.createElement('nav');bar.className='mbar';bar.setAttribute('aria-label','すぐに相談する');
  bar.innerHTML='<a href="'+(document.getElementById('check')?'#check':'shindan.html')+'">意識度チェック（3分）</a><a data-line href="'+(lineUrl||'#')+'" target="_blank" rel="noopener noreferrer">LINEで相談</a>';
  document.body.appendChild(bar);window.taidoLine(bar);
}

// アイコンを描く：黒い線 → 青い線の順
const draw=svg=>{svg.classList.remove('drawn');void svg.getBoundingClientRect();svg.classList.add('drawn')};

// 見出しが打ち込まれる（iroawase の型）
const typeHeadline=done=>{
  const h=document.querySelector('[data-type]');
  if(!h||!animate){done&&done();return}
  h.setAttribute('aria-label',h.textContent.replace(/\s+/g,''));
  const chars=[];
  const wrap=node=>{[...node.childNodes].forEach(n=>{
    if(n.nodeType===3){const f=document.createDocumentFragment();[...n.textContent].forEach(c=>{const s=document.createElement('span');s.className='ch';s.textContent=c;s.setAttribute('aria-hidden','true');f.appendChild(s);chars.push(s)});n.replaceWith(f)}
    else if(n.nodeType===1)wrap(n)})};
  wrap(h);h.classList.add('typing');
  const caret=document.createElement('span');caret.className='caret';caret.setAttribute('aria-hidden','true');
  let i=0;const tick=()=>{if(i<chars.length){chars[i].classList.add('on');chars[i].after(caret);i++;setTimeout(tick,chars[i-1].textContent==='、'?420:140)}else{done&&done()}};
  setTimeout(tick,700);
};

// ロゴの濁点がうなずく
const logo=document.querySelector('.logo');
const nod=()=>{if(!logo||!animate)return;logo.classList.remove('nod');void logo.getBoundingClientRect();logo.classList.add('nod')};

if(animate){
  // 1) 帯が上から伸び、人物が描き出され、見出しが打たれ、最後に濁点がうなずく
  requestAnimationFrame(()=>root.classList.add('ready'));
  typeHeadline(()=>setTimeout(nod,200));
  logo&&logo.closest('a').addEventListener('mouseenter',nod);

  // 2) ナビのアイコンは、最初に描いて、触れるたびに描き直す
  document.querySelectorAll('.site-header nav svg.ic').forEach((svg,i)=>{
    setTimeout(()=>draw(svg),300+i*90);
    svg.closest('a').addEventListener('mouseenter',()=>draw(svg));
    svg.closest('a').addEventListener('focus',()=>draw(svg));
  });

  // 3) 画面に入ったら現れる・描かれる
  const sel='.contact-ways,.start-steps li,.case-list li,.why-list li,.svc-list li,.svc-group-h,.entry,.layers li,.layers-note,.goal-list li,.diag-types,.label,.sec h2,.sec-lead,.issue-list li,.issue-body>*,.step,.solo,.timeline li,.caution li,.value-list li,.work,.local-grid,.card-replica,.about-main>*,.faq-list,.contact .actions';
  const items=[...document.querySelectorAll(sel)];
  items.forEach(el=>el.classList.add('rv'));
  // 同じ親の中で順番に少しずつ遅らせる
  const groups=new Map();items.forEach(el=>{const k=el.parentElement;groups.set(k,(groups.get(k)||0)+1);el.style.setProperty('--d',(groups.get(k)-1)*90+'ms')});
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;el.classList.add('in');el.querySelectorAll('svg.ic').forEach(s=>setTimeout(()=>draw(s),parseInt(el.style.getPropertyValue('--d'))||0));io.unobserve(el)}),{rootMargin:'0px 0px -12% 0px',threshold:.12});
  items.forEach(el=>io.observe(el));
  document.querySelectorAll('.entry').forEach(a=>a.addEventListener('mouseenter',()=>a.querySelectorAll('svg.ic').forEach(draw)));
}
})();

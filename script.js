(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

// 名刺を裏返す
const card=document.querySelector('.card'),flip=document.querySelector('.card-flip');
if(card&&flip){
  const front=card.querySelector('.card-front'),back=card.querySelector('.card-back');
  const set=b=>{card.dataset.side=b?'back':'front';flip.setAttribute('aria-pressed',String(b));flip.textContent=b?'名刺の表を見る':'名刺の裏を見る';front.setAttribute('aria-hidden',String(b));back.setAttribute('aria-hidden',String(!b));};
  set(false);
  flip.addEventListener('click',()=>set(card.dataset.side!=='back'));
}

// ふたりの態度が、順に変わる
const pair=document.querySelector('.pair');
if(pair){
  const a=pair.querySelector('.pair-a'),b=pair.querySelector('.pair-b'),cap=document.querySelector('.pair-caption'),replay=document.querySelector('.pair-replay');
  const steps=[['back','back','ふたりとも、腕を組んでいる。'],['lean','back','ひとりが、身を乗り出す。'],['lean','lean','もうひとりも、乗ってくる。'],['up','up','ウケた。']];
  let timers=[];
  const show=i=>{const s=steps[i];a.dataset.pose=s[0];b.dataset.pose=s[1];pair.dataset.step=i;cap.textContent=s[2];};
  const play=()=>{timers.forEach(clearTimeout);timers=[];if(reduce){show(3);return;}show(0);[1,2,3].forEach((i,k)=>timers.push(setTimeout(()=>show(i),900+k*1300)));};
  replay.addEventListener('click',play);
  if('IntersectionObserver' in window){
    const io=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){play();io.disconnect();}},{threshold:.5});
    io.observe(pair);
  }else show(3);
}
})();

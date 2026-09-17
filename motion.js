/* Independent, viewport-aware playlists; no zoom, parallax or image wobble. */
(()=>{'use strict';
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
setTimeout(()=>document.querySelector('.arrival')?.remove(),1400);
const scenes={conversation:{label:'対話の時間',title:'まずは、話すことから。',file:'conversation-v3.mp4'},notebook:{label:'お店らしさを、かたちに',title:'お店の空気を、そのままサイトに。',file:'notebook-v5.mp4'},cups:{label:'話す',title:'二人分の湯のみ。',file:'cups-v1.mp4'},desk:{label:'かたちにする',title:'机の上の紙。',file:'desk-v1.mp4'},evening:{label:'夕方',title:'夕方の光。',file:'evening-v1.mp4'},room2:{label:'午後の部屋',title:'午後の部屋。',file:'room-v2.mp4'}};
document.querySelector('.arrival')?.addEventListener('animationend',e=>{if(e.animationName==='arrival-out')e.currentTarget.remove()});
document.querySelectorAll('[data-playlist]').forEach(host=>{
 const ids=host.dataset.playlist.split(',');let current=0,visible=false,paused=reduce.matches;
 const control=host.querySelector('.cinema-toggle')||(host.closest('.process')?.querySelector('.process-motion'));
 const buttons=[];const films=ids.map((id,i)=>{const v=document.createElement('video');v.className='film';v.dataset.scene=id;v.muted=true;v.playsInline=true;v.preload='none';v.setAttribute('aria-hidden','true');v.setAttribute('disablepictureinpicture','');v.dataset.src='assets/'+scenes[id].file;host.insertBefore(v,host.firstChild);v.addEventListener('ended',()=>{if(!paused&&visible&&!document.hidden)select((current+1)%ids.length)});return v});
 const setLabel=()=>{if(control){const label=(host.classList.contains('process-bg')?'背景映像を':'映像と文字の動きを')+(paused?'再生':'一時停止');control.textContent='';control.setAttribute('aria-label',label);control.title=label;control.setAttribute('aria-pressed',String(paused))}};
 function play(){if(paused||!visible||document.hidden)return;const v=films[current];if(!v.src){v.src=v.dataset.src;v.load()}v.play().then(()=>{if(v!==films[current]){v.pause();return}if(!paused&&visible&&!document.hidden){films.forEach(x=>x.classList.toggle('is-current',x===v))}else v.pause()}).catch(()=>{if(current===films.indexOf(v)){paused=true;setLabel()}})}
 function select(i){films.forEach(v=>v.pause());current=i;const id=ids[i];const title=host.querySelector('.cinema-title'),count=host.querySelector('.cinema-count');if(title)title.textContent=scenes[id].title;if(count)count.textContent=String(i+1).padStart(2,'0')+' / '+String(ids.length).padStart(2,'0');buttons.forEach((b,n)=>b.setAttribute('aria-pressed',String(n===i)));const v=films[i];v.currentTime=0;const poster=host.querySelector('img');if(poster){poster.src='assets/'+id+'-poster.jpg';if(poster.alt)poster.alt=scenes[id].title}if(paused){films.forEach(v=>v.classList.remove('is-current'))}else play()}
 ids.forEach((id,i)=>{const bar=host.querySelector('.scene-select');if(!bar)return;const b=document.createElement('button');b.type='button';b.textContent=scenes[id].label;b.setAttribute('aria-label',scenes[id].label+'の映像を選ぶ');b.setAttribute('aria-pressed',String(i===0));b.addEventListener('click',()=>select(i));bar.append(b);buttons.push(b)});
 control?.addEventListener('click',()=>{paused=!paused;setLabel();if(paused)films.forEach(v=>v.pause());else play()});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible)play();else films.forEach(v=>v.pause())},{threshold:.1}).observe(host);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)films.forEach(v=>v.pause());else play()});
 reduce.addEventListener('change',e=>{if(e.matches){paused=true;films.forEach(v=>v.pause());setLabel()}});setLabel();
});
const hero=document.querySelector('.editorial-hero');let glyph=0;
const layers=[...document.querySelectorAll('.shape-layer')];
setInterval(()=>{if(!hero||reduce.matches||document.hidden||hero.getBoundingClientRect().bottom<=0||hero.querySelector('.cinema-toggle')?.getAttribute('aria-pressed')==='true')return;glyph=(glyph+1)%layers.length;layers.forEach((layer,i)=>layer.classList.toggle('is-active',i===glyph))},3800);
})();

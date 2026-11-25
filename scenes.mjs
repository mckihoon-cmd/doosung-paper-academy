// Keep normal document scrolling and native touch/keyboard behavior. Oversized
// scenes remain readable: native scroll snap allows scrolling within them.
export function initScenes(){
  const main=document.getElementById('main');
  const makeLabScene=(node,id,theme,after)=>{
    const scene=document.createElement('section');scene.id=id;scene.className=`lab-scene ${theme}`;
    const inner=document.createElement('div');inner.className='wrap';inner.append(node);scene.append(inner);after.after(scene);return scene;
  };
  const weightScene=makeLabScene(document.getElementById('lab'),'weight-scene','tinted',document.getElementById('ch2'));
  makeLabScene(document.querySelector('.grain-lab'),'grain-scene','tinted',weightScene);
  makeLabScene(document.querySelector('.cut-lab'),'cut-scene','',document.getElementById('ch5'));
  // Separate finishing from the print comparison so it is a distinct stop.
  const finishing=makeLabScene(document.querySelector('.finishes'),'finishing-scene','dark',document.getElementById('ch4'));
  const finishingHeading=document.createElement('div');finishingHeading.className='chapter-heading';
  finishingHeading.innerHTML='<span class="chapter-no">04</span><div><p class="eyebrow">FINISHING & BINDING</p><h2>마지막 공정까지, 완성도를 생각합니다.</h2></div>';
  finishing.firstElementChild.prepend(finishingHeading);
  const footer=document.querySelector('footer');footer.id='closing';main.append(footer);
  const titles={home:'한 장의 종이, 가능성의 시작',chapters:'종이 탐색 목차',ch1:'01 · 종이의 이해',ch2:'02 · 기본 지식','weight-scene':'LAB 01 · 중량 계산기','grain-scene':'LAB 02 · 종이결 비교',ch3:'03 · 종류와 특성',ch4:'04 · 인쇄 비교','finishing-scene':'04 · 후가공과 제본',ch5:'05 · 용도별 선택','cut-scene':'LAB 04 · 재단 시뮬레이션',ch6:'06 · 두성종이 소개',quiz:'LAB 05 · 복습 퀴즈',closing:'한 장에서 시작하는 새로운 가능성'};
  const scenes=[...main.children];
  scenes.forEach((scene,i)=>{
    scene.classList.add('scene');scene.dataset.scene=String(i+1);
    scene.setAttribute('aria-label',titles[scene.id]);
    // A content wrapper is the animation target; the snap target stays still.
    if(scene.classList.contains('wrap')){
      scene.classList.remove('wrap');const inner=document.createElement('div');inner.className='wrap scene-content';
      inner.append(...scene.childNodes);scene.append(inner);
    }else scene.firstElementChild.classList.add('scene-content');
  });
  const controls=document.createElement('nav');controls.id='scene-controls';controls.setAttribute('aria-label','장면 이동');
  controls.innerHTML='<span class="scene-hint">SCROLL TO EXPLORE ↓</span><span id="scene-label"></span><div class="scene-pager"><button id="scene-prev" aria-label="이전 장면">↑</button><output id="scene-count" aria-live="polite" aria-atomic="true"></output><button id="scene-next" aria-label="다음 장면">↓</button></div>';
  document.body.append(controls);document.documentElement.classList.add('scene-mode');
  document.querySelectorAll('a[href="#lab"]').forEach(link=>link.setAttribute('href','#weight-scene'));
  const root=document.documentElement,header=document.querySelector('header'),bar=document.querySelector('.demo-bar');
  let current=-1,queued=false;
  const measure=()=>{
    const bh=bar.getBoundingClientRect().height,hh=header.getBoundingClientRect().height;
    root.style.setProperty('--demo-height',`${bh}px`);root.style.setProperty('--chrome-height',`${bh+hh}px`);
  };
  const sync=()=>{
    queued=false;const line=parseFloat(getComputedStyle(root).getPropertyValue('--chrome-height'))+Math.min(innerHeight*.2,150);
    let index=0;for(let i=0;i<scenes.length;i++){if(scenes[i].getBoundingClientRect().top<=line)index=i;else break;}
    if(index===current)return;
    if(current>=0)scenes[current].classList.remove('is-current');
    current=index;scenes[current].classList.add('is-current');
    document.getElementById('scene-count').textContent=`${String(index+1).padStart(2,'0')} / ${String(scenes.length).padStart(2,'0')}`;
    document.getElementById('scene-label').textContent=titles[scenes[index].id];
    document.getElementById('scene-prev').disabled=index===0;document.getElementById('scene-next').disabled=index===scenes.length-1;
    document.getElementById('progress').style.width=`${(index+1)/scenes.length*100}%`;
    document.body.dataset.sceneTheme=scenes[index].classList.contains('dark')?'dark':'light';
  };
  const schedule=()=>{if(!queued){queued=true;requestAnimationFrame(sync);}};
  const go=delta=>{const target=scenes[current+delta];if(target)target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});};
  document.getElementById('scene-prev').addEventListener('click',()=>go(-1));document.getElementById('scene-next').addEventListener('click',()=>go(1));
  addEventListener('scroll',schedule,{passive:true});
  new ResizeObserver(()=>{measure();schedule();}).observe(header);
  new ResizeObserver(()=>{measure();schedule();}).observe(bar);
  addEventListener('resize',()=>{measure();schedule();});
  measure();sync();
  // Reapply a deep link after moving the lab nodes into their own scenes.
  const anchor=document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if(anchor)requestAnimationFrame(()=>anchor.closest('.scene')?.scrollIntoView({behavior:'instant',block:'start'}));
}

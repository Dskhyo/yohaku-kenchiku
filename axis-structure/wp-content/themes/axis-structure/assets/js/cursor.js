AxisMotion.cursor = () => {
  const media=matchMedia('(pointer:fine) and (hover:hover) and (prefers-reduced-motion:no-preference)');
  let dispose=()=>{};
  const setup=()=>{dispose();if(!media.matches)return;const cursor=document.createElement('div');cursor.className='axis-cursor';cursor.setAttribute('aria-hidden','true');document.body.append(cursor);let frame=0,x=0,y=0;
    const move=e=>{x=e.clientX;y=e.clientY;cursor.textContent=e.target.closest('.project-card')?'VIEW':e.target.closest('.technology')?'EXPLORE':e.target.closest('.contact')?'CONTACT':'＋';if(!frame)frame=requestAnimationFrame(()=>{cursor.style.transform=`translate(${x+17}px,${y+16}px)`;cursor.classList.add('is-visible');frame=0;});};
    const leave=()=>cursor.classList.remove('is-visible');
    document.addEventListener('pointermove',move);document.addEventListener('pointerleave',leave);
    dispose=()=>{cancelAnimationFrame(frame);document.removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);cursor.remove();};
  };setup();media.addEventListener('change',setup);return ()=>{dispose();media.removeEventListener('change',setup);};
};

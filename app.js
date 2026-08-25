(() => {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu-principal');
  if (toggle && menu) {
    const close = () => { menu.classList.remove('is-open'); toggle.setAttribute('aria-expanded','false'); toggle.setAttribute('aria-label','Abrir menu'); };
    toggle.addEventListener('click',()=>{ const open=menu.classList.toggle('is-open'); toggle.setAttribute('aria-expanded',String(open)); toggle.setAttribute('aria-label',open?'Fechar menu':'Abrir menu'); });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',close));
    document.addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
    window.addEventListener('resize',()=>{ if(innerWidth>860) close(); });
  }
})();
(async()=>{
  let manifest={};
  try{ manifest=await (await fetch('assets/manifest.json',{cache:'force-cache'})).json(); }catch(e){ console.error('Falha no manifesto de imagens',e); return; }
  for(const img of document.querySelectorAll('img[data-b64-src]')){
    const key=img.dataset.b64Src.split('/').pop().replace('.b64','');
    const files=manifest[key]||[];
    try{
      const parts=await Promise.all(files.map(async (f,i)=>{
        const r=await fetch('assets/'+f,{cache:'force-cache'});
        if(!r.ok)throw new Error(String(r.status));
        let text=(await r.text()).trim();
        if(i<files.length-1 && text.length>12000) text=text.slice(0,12000);
        return text;
      }));
      img.src='data:image/webp;base64,'+parts.join('');
    } catch(e){ console.error('Falha ao carregar imagem',key,e); }
  }
})();
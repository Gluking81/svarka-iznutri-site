import PhotoSwipeLightbox from '/assets/vendor/photoswipe/photoswipe-lightbox.esm.js';

const lightbox=new PhotoSwipeLightbox({
  gallery: '.photo-gallery',
  children: 'a.photo-zoom',
  pswpModule: () => import('/assets/vendor/photoswipe/photoswipe.esm.js'),
  bgOpacity: 0.92,
  showHideAnimationType: 'zoom',
  loop: false,
});
lightbox.on('uiRegister', () => {
  lightbox.pswp.ui.registerElement({
    name: 'editorial-caption',
    order: 9,
    isButton: false,
    appendTo: 'root',
    html: '',
    onInit: (el, pswp) => {
      el.className='pswp__custom-caption';
      const update = () => {
        const a=pswp.currSlide?.data?.element;
        const fig=a?.closest('figure');
        el.textContent=fig?.querySelector('figcaption')?.textContent?.trim() || a?.querySelector('img')?.alt || '';
      };
      pswp.on('change', update);
      update();
    }
  });
});
lightbox.init();
document.documentElement.dataset.lightboxReady='true';

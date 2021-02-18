export const popupBgFMV = {
  hidden: { opacity: 0, transition: { ease: 'easeIn', duration: 0.075 }, },
  visible: { opacity: 0.25, transition: { ease: 'easeOut', duration: 0.1 }, },
};

export const popupFMV = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: { ease: 'easeIn', duration: 0.075 },
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { ease: 'easeOut', duration: 0.1 },
  },
};

export const canvasFMV = /** @type {any} */ ({
  hidden: {
    transition: { when: 'afterChildren' },
    transitionEnd: { visibility: 'hidden' },
  },
  visible: {
    visibility: 'visible',
  },
});

export const sideBarOverlayFMV = {
  hidden: { opacity: 0, transition: { ease: 'easeIn', duration: 0.075 }, },
  visible: { opacity: 1, transition: { ease: 'easeOut', duration: 0.1 }, },
};

export const sideBarFMV = {
  hidden: {
    translateX: '-100%',
    transition: { ease: 'easeIn', duration: 0.075 },
  },
  visible: {
    translateX: '0%',
    transition: { ease: 'easeOut', duration: 0.1 },
  },
};

export const rightPanelFMV = {
  hidden: {
    translateX: '100%',
    transition: { ease: 'easeIn', duration: 0.075 },
  },
  visible: {
    translateX: '0%',
    transition: { ease: 'easeOut', duration: 0.1 },
  },
};
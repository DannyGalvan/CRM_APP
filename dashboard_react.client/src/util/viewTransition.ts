export const transitionViewIfSupported = (updateCb: () => void) => {
  if (document.startViewTransition) {
    document.startViewTransition(updateCb);
  } else {
    updateCb();
  }
};


export const retrase = async (ms: number) => new Promise((res) => setTimeout(res, ms));
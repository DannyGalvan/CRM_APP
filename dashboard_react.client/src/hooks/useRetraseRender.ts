import { useState } from 'react';

export const useRetraseRender = () => {
  const [render, setRender] = useState(false);

  const reRender = () => {
    setTimeout(() => {
      setRender(true);
    }, 800);
  };

  return { reRender, render };
}

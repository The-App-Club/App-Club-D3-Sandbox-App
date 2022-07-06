import {useMotionValue} from 'framer-motion';
import {
  useCallback,
  useContext,
  createContext,
  useLayoutEffect,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/all';
import {ScrollToPlugin} from 'gsap/all';
import {MathUtils} from 'three';

const ScrollTriggerContext = createContext({
  progress: 0,
});

const useScrollTrigger = () => {
  return useContext(ScrollTriggerContext);
};

const ScrollTriggerProvider = ({
  children,
  pcSectionHeight,
  spSectionHeight,
  handleChangeProgress,
}) => {
  const scrollTriggerRef = useRef(null);
  const progress = useMotionValue(0);
  const setParagraphsRef = useCallback((domList) => {
    paragraphDomList.current = null;
    paragraphDomList.current = domList;
  }, []);

  const value = useMemo(() => {
    return {
      progress,
    };
  }, [progress]);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // リサイズ時のトリガーの開始と終了の位置を再構築するために必要
    // https://www.youtube.com/watch?v=R7-3oEiDaZo
    ScrollTrigger.matchMedia({
      '(min-width: 769px)': () => {
        ScrollTrigger.create({
          trigger: scrollTriggerRef.current,
          start: 'top top',
          end: `bottom+=${pcSectionHeight} top`,
          toggleClass: 'is-crossed',
          markers: false,
          scrub: 1,
          pin: true,
          onUpdate: (e) => {
            const p = MathUtils.clamp(e.progress, 0, 1);
            progress.set(p);
            handleChangeProgress(p);
          },
          onEnter: (e) => {
            console.log('[enter]');
          },
          onLeave: (e) => {
            console.log('[leave]');
          },
          onEnterBack: (e) => {
            console.log('[enterback]');
          },
          onLeaveBack: (e) => {
            console.log('[leaveback]');
          },
        });
      },
      '(max-width: 768px)': () => {
        ScrollTrigger.create({
          trigger: scrollTriggerRef.current,
          start: 'top top',
          end: `bottom+=${spSectionHeight} top`,
          toggleClass: 'is-crossed',
          markers: false,
          scrub: 1,
          pin: true,
          onUpdate: (e) => {
            const p = MathUtils.clamp(e.progress, 0, 1);
            progress.set(p);
            handleChangeProgress(p);
          },
          onEnter: (e) => {
            console.log('[enter]');
          },
          onLeave: (e) => {
            console.log('[leave]');
          },
          onEnterBack: (e) => {
            console.log('[enterback]');
          },
          onLeaveBack: (e) => {
            console.log('[leaveback]');
          },
        });
      },
    });

    ScrollTrigger.refresh();

    return () => {
      ScrollTrigger.kill();
    };
    // eslint-disable-next-line
  }, []);
  return (
    <div ref={scrollTriggerRef}>
      <ScrollTriggerContext.Provider value={value}>
        {children}
      </ScrollTriggerContext.Provider>
    </div>
  );
};

export {ScrollTriggerProvider, useScrollTrigger};

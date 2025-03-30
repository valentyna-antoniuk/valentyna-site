import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

import { careerJourney } from "./steps";
import styles from "./path.module.scss";

export const HorizontalPath = () => {
  const scrollRef = useRef<HTMLUListElement | null>(null);

  const [scrollWidth, setScrollWidth] = useState(0);

  const { scrollXProgress } = useScroll({ container: scrollRef });
  const width = useTransform(scrollXProgress, [0, 1], ["10%", "100%"]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const maxScrollLeft = scrollWidth - clientWidth;
        const rect = scrollRef.current.getBoundingClientRect();

        const blockCenter = rect.top + rect.height / 2;

        const isCentered =
          blockCenter > window.innerHeight / 3 &&
          blockCenter < (window.innerHeight * 2) / 3;

        const scrollSpeed = 0.7;

        if (
          isCentered &&
          ((scrollLeft > 0 && e.deltaY < 0) ||
            (scrollLeft < maxScrollLeft && e.deltaY > 0))
        ) {
          e.preventDefault();
          scrollRef.current.scrollLeft += e.deltaY * scrollSpeed;
        }
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel);
    };
  }, []);

  useEffect(() => {
    const unsubscribe = width.onChange((latest) => {
      setScrollWidth(parseInt(latest, 10));
    });
    return () => unsubscribe();
  }, [width]);

  return (
    <div>
      <motion.div
        className={styles.progress}
        style={{ width }}
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      />
      <motion.ul className={styles.timeline} ref={scrollRef}>
        <motion.li
          initial={{ opacity: 1, x: -200 }}
          viewport={{ once: true, amount: 0.3 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.4,
            scale: { type: "inertia", visualDuration: 0.4, bounce: 0.5 },
          }}
          className={styles.start}
        >
          it all began from ...
        </motion.li>
        {careerJourney.map(({ text, emoji }, index) => (
          <motion.li
            key={index}
            data-index={index}
            className={styles.step}
            style={index === 0 ? { marginLeft: "500px" } : undefined}
            initial={{ y: index % 2 ? 150 : -150, opacity: 0 }}
            animate={
              scrollWidth > 23 + index * 6 ? { y: 0, opacity: 1 } : undefined
            }
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <div className={styles.space} />
            <span className={styles.icon}>{emoji}</span>
            <span
              className={styles.text}
              dangerouslySetInnerHTML={{ __html: text }}
            />
          </motion.li>
        ))}
        <motion.li className={styles.start}>
          to be continued ...
        </motion.li>
      </motion.ul>
    </div>
  );
};

import React, { useEffect, useRef, useState } from "react";
import { careerJourney } from "./steps";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from './path.module.scss';

const CareerJourney = () => {
    const scrollRef = useRef<HTMLUListElement | null>(null);

    const [scrollWidth, setScrollWidth] = useState(0);

    const { scrollXProgress } = useScroll({ container: scrollRef });
    const width = useTransform(scrollXProgress, [0, 1], ["0%", "100%"]);

    useEffect(() => {
        const handleWheel = (e: WheelEvent) => {
            if (scrollRef.current) {
                const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
                const maxScrollLeft = scrollWidth - clientWidth;
                const rect = scrollRef.current.getBoundingClientRect();

                const isInView = rect.top < window.innerHeight && rect.bottom > 0;

                if (isInView && ((scrollLeft > 0 && e.deltaY < 0) || (scrollLeft < maxScrollLeft && e.deltaY > 0))) {
                    e.preventDefault();
                    scrollRef.current.scrollLeft += e.deltaY;
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

    return (<div>
        <motion.div
            className={styles.progress}
            style={{width}}
            transition={{type: "spring", stiffness: 100, damping: 20}}
        />
                <motion.ul className={styles.timeline} ref={scrollRef}
                    initial={{paddingLeft: '20%'}}
                    animate={scrollWidth > 15 ? {paddingLeft: 0} : undefined}
                           transition={{
                               duration: 1,
                           }}
                >

                    <motion.li
                        initial={{opacity: 0, scale: 0}}
                        animate={{opacity: 1, scale: 1}}
                        transition={{
                            duration: 0.4,
                            scale: {type: "spring", visualDuration: 0.4, bounce: 0.5},
                        }}
                        className={styles.start}
                    >
                        it all began from ...
                    </motion.li>
                    {careerJourney.map(({text, emoji}, index) => (
                        <motion.li
                            key={index}
                            data-index={index}
                            className={styles.step}
                            initial={{y: index % 2 ? 100 : -100, opacity: 0} }
                            animate={scrollWidth > index * 8 ? {y: 0, opacity: 1} : undefined}
                            transition={{duration: 0.5, ease: "easeOut"}}
                        >
                            <div className={styles.space}/>
                            <span className={styles.icon}>{emoji}</span>
                            <span className={styles.text} dangerouslySetInnerHTML={{__html: text}}/>
                        </motion.li>
                    ))}
                    <li className={styles.start}>to be continued ...</li>
                </motion.ul>
            </div>
            );
            };
            export default CareerJourney;
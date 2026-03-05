import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import CesiumGlobe from './CesiumGlobe';

export default function PinkAnimationHome({ goTo, goToCity }) {
    const title = '一路向哪？'.split('');
    const subtitle = 'To Where?'.split('');
    const [waterfallImages, setWaterfallImages] = useState([]);
    const containerRef = useRef(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [showPlayButton, setShowPlayButton] = useState(false);
    const videoRef = useRef(null);

    // Optimized Scroll Hook
    const { scrollY } = useScroll({ container: containerRef });

    // Performance: Only update state for elements that require severe DOM/Component remounts
    const [globeProgress, setGlobeProgress] = useState(0);
    const [isVideoActive, setIsVideoActive] = useState(true);

    // Derived transform styles (bypasses React renders)
    const bgOpacity = useTransform(scrollY, [window.innerHeight * 0.2, window.innerHeight * 0.4], [0, 1]);
    const videoOpacityAnim = useTransform(scrollY, [0, window.innerHeight * 0.5], [1, 0]);
    const waterfallY = useTransform(scrollY, [0, window.innerHeight * 2], [0, -window.innerHeight]);
    const waterfallOpacity = useTransform(scrollY, [0, window.innerHeight * 0.1, window.innerHeight * 0.3], [0, 0, 1]);

    // Title Opacity: Gradually shows up as we scroll from screen 1 to screen 2
    const titleOpacity = useTransform(scrollY, [window.innerHeight * 0.4, window.innerHeight * 0.8], [0, 1]);
    const subtitleOpacity = useTransform(scrollY, [window.innerHeight * 0.6, window.innerHeight * 0.9], [0, 1]);

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Globe progress: transition during screen 3 (from 1.0 to 2.0 window heights)
        const start = window.innerHeight * 1.0;
        const end = window.innerHeight * 2.0;
        if (latest > start) {
            setGlobeProgress(Math.max(0, Math.min((latest - start) / (end - start), 1)));
        } else if (globeProgress > 0) {
            setGlobeProgress(0);
        }

        if (latest > window.innerHeight * 0.6 && isVideoActive) {
            setIsVideoActive(false);
        } else if (latest <= window.innerHeight * 0.6 && !isVideoActive) {
            setIsVideoActive(true);
        }
    });

    useEffect(() => {
        const cityImages = {
            '台北': ['IMG_20250625_170257.jpg', 'IMG_20250625_170300.jpg', 'IMG_20250625_184612.jpg'],
            '台南': ['IMG_20250627_160837.jpg', 'IMG_20250627_161727.jpg'],
            '成都': ['1.jpg', '2.jpg', '3.jpg', '4.jpg', 'IMG_0814.jpeg'],
            '深圳': ['IMG_0029.jpg', 'IMG_0044.jpg', 'IMG_0048.jpg', 'IMG_0103.jpg'],
            '广元': ['1.jpg', '2.jpg', 'IMG_0809.jpeg'],
            '香港': ['IMG_20241202_065859.jpg', 'IMG_20250208_080930.jpg']
        };

        const images = [];
        Object.entries(cityImages).forEach(([city, imageFiles]) => {
            imageFiles.forEach((fileName, index) => {
                images.push({
                    src: `/images/cities/${city}/${fileName}`,
                    city,
                    index: index + 1,
                    height: Math.floor(Math.random() * 250) + 400,
                });
            });
        });

        const shuffledImages = images.sort(() => Math.random() - 0.5).slice(0, 20);
        setWaterfallImages(shuffledImages);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            const video = videoRef.current;
            if (video && isVideoActive) {
                video.muted = true;
                const playPromise = video.play();
                if (playPromise !== undefined) {
                    playPromise.then(() => setShowPlayButton(false)).catch(() => setShowPlayButton(true));
                }
            }
        }, 1000);
        return () => clearTimeout(timer);
    }, [isVideoActive]);

    const handlePlayVideo = () => {
        const video = videoRef.current;
        if (video) {
            video.muted = true;
            video.play().then(() => setShowPlayButton(false)).catch(e => console.error(e));
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                width: '100vw', height: '100vh', overflowY: 'auto', overflowX: 'hidden', scrollBehavior: 'smooth'
            }}
        >
            {/* Background Base */}
            <motion.div style={{
                position: 'fixed', inset: 0, zIndex: 0,
                background: '#F6BEC8',
                opacity: bgOpacity,
                pointerEvents: 'none'
            }} />

            {/* 屏1：粉色标题与视频 */}
            <div style={{
                width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden'
            }}>
                <motion.div
                    style={{
                        position: 'absolute',
                        top: '70%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 10,
                        textAlign: 'center',
                        opacity: titleOpacity // Bind to scroll
                    }}
                >
                    <div style={{ display: 'flex', marginBottom: '20px', justifyContent: 'center' }}>
                        {title.map((char, index) => (
                            <motion.span key={index}
                                style={{ fontSize: '5rem', fontWeight: 'bold', color: '#3D3B4F', margin: '0 0.1rem' }}>
                                {char}
                            </motion.span>
                        ))}
                    </div>
                    <motion.div style={{ display: 'flex', justifyContent: 'center', opacity: subtitleOpacity }}>
                        {subtitle.map((char, index) => (
                            <motion.span key={index}
                                style={{ fontSize: '2rem', fontWeight: '300', color: '#3D3B4F' }}>
                                {char === ' ' ? '\u00A0' : char}
                            </motion.span>
                        ))}
                    </motion.div>
                </motion.div>

                {showPlayButton && isVideoActive && (
                    <motion.button
                        onClick={handlePlayVideo}
                        style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 10, padding: '20px', borderRadius: '50%', fontSize: '2rem', border: 'none', background: 'rgba(255,255,255,0.8)', color: '#F6BEC8', cursor: 'pointer' }}
                    >▶</motion.button>
                )}

                {isVideoActive && (
                    <motion.video ref={videoRef} autoPlay muted loop playsInline
                        style={{
                            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1,
                            opacity: videoOpacityAnim
                        }}
                        onLoadedData={() => setVideoLoaded(true)}
                    >
                        <source src="/video/all.mp4" type="video/mp4" />
                    </motion.video>
                )}

                <motion.div
                    animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
                    style={{ position: 'absolute', bottom: '5%', zIndex: 15, cursor: 'pointer', textAlign: 'center', opacity: videoOpacityAnim }}
                    onClick={() => containerRef.current?.scrollTo({ top: window.innerHeight * 0.6, behavior: 'smooth' })}
                >
                    <div style={{ color: 'rgba(61, 59, 79, 0.8)', marginBottom: '8px' }}>探索更多</div>
                    <div style={{ fontSize: '2rem', color: '#3D3B4F' }}>↓</div>
                </motion.div>
            </div>

            {/* 屏2：瀑布流 */}
            <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', zIndex: 2 }}>
                <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '200vh', display: 'flex', gap: '20px', padding: '60px 40px', y: waterfallY, opacity: waterfallOpacity, zIndex: 5 }}>
                    {[0, 1, 2, 3].map(col => (
                        <div key={col} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {waterfallImages.filter((_, i) => i % 4 === col).map((img, i) => (
                                <div key={i}
                                    style={{ width: '100%', height: `${img.height}px`, borderRadius: '12px', overflow: 'hidden', background: 'rgba(255,255,255,0.1)' }}
                                >
                                    <img src={img.src} alt="City" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                                </div>
                            ))}
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* 屏3：地球过渡 */}
            <div style={{ width: '100vw', height: '100vh', position: 'relative', background: 'linear-gradient(to bottom, transparent, #000 30%)', overflow: 'hidden', zIndex: 3 }}>
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100vw',
                    height: '100vh',
                    opacity: globeProgress > 0 ? 1 : 0,
                    pointerEvents: globeProgress > 0.95 ? 'auto' : 'none',
                    visibility: globeProgress > 0 ? 'visible' : 'hidden' // Always mounted but hidden when not needed
                }}>
                    <CesiumGlobe goToCity={goToCity} transitionMode={true} scrollProgress={globeProgress} scrollY={scrollY} />
                </div>

                {globeProgress < 0.95 && <div style={{ position: 'absolute', inset: 0, zIndex: 100, pointerEvents: 'none' }} />}

                {globeProgress > 0.8 && globeProgress < 0.95 && (
                    <div style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', color: 'rgba(255,255,255,0.8)', zIndex: 10 }}>继续向下滑动解锁地球交互</div>
                )}

                {globeProgress > 0.95 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        style={{ position: 'absolute', bottom: '20%', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}
                    >
                        <button onClick={() => goTo('globe')} style={{ padding: '15px 30px', fontSize: '1.5rem', color: 'white', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', borderRadius: '25px', cursor: 'pointer', backdropFilter: 'blur(10px)' }}>点击进入探索之旅</button>
                    </motion.div>
                )}
            </div>
        </div>
    );
}

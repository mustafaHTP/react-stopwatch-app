import { useEffect } from "react";
import { useState, useRef } from "react";
import styles from './Stopwatch.module.css';
import clickSfx from '/src/assets/click.wav';
import backgroundMusic from '/src/assets/background.mp3';

function Stopwatch() {

    const [elapsedTime, setElapsedTime] = useState(0);
    const [shouldRun, setIsRunning] = useState(false);
    const [backgroundMusicVolume, setBackgroundMusicVolume] = useState(0.6);
    const startTimeRef = useRef(0);
    const intervalId = useRef(null);
    const backgroundMusicAsset = useRef(new Audio(backgroundMusic));

    useEffect(() => {
        if (shouldRun) {
            //Start
            startTimeRef.current = Date.now() - elapsedTime;
            intervalId.current = setInterval(() => {
                setElapsedTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            //Stop
            clearInterval(intervalId.current);
        }

        return () => {
            clearInterval(intervalId.current);
        }
    }, [shouldRun]);


    const handleStart = async () => {
        await playBackgroundMusic();
        setIsRunning(true);
    }

    const handleStop = () => {
        setIsRunning(false);
    }

    const handleReset = () => {
        setIsRunning(false);
        setElapsedTime(0);
    }

    const handleOnMouseOver = async () => {
        await playClickSfx();
    }

    const handleVolumeChange = async (event) => {
        //normalize the volume value
        setBackgroundMusicVolume(event.target.value / 100);
        backgroundMusicAsset.current.volume = event.target.value / 100;
    }

    const playClickSfx = async () => {
        const clickSfxAsset = new Audio(clickSfx);
        await clickSfxAsset.play();
    }

    const playBackgroundMusic = async () => {
        backgroundMusicAsset.current.volume = backgroundMusicVolume;
        backgroundMusicAsset.current.loop = true;
        await backgroundMusicAsset.current.play();
    }

    const formatElapsedTime = (time) => {
        const minutes = Math.floor(time / (1000 * 60));
        const seconds = Math.floor(time / 1000 % 60);
        const milliseconds = Math.floor(time % 1000 / 10);

        return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(milliseconds).padStart(2, '0')}`;
    }

    return (
        <div className={styles['container']}>
            <div className={styles['stopwatch-container']}>
                <h1 className={styles['stopwatch-title']}>Stopwatch</h1>
                <div className={styles['stopwatch-elapsed-time']}>{formatElapsedTime(elapsedTime)}</div>
                <div className={styles['button-container']}>
                    <button onMouseOver={handleOnMouseOver} className={`${styles['btn']} ${styles['btn-start']}`} onClick={handleStart}>Start</button>
                    <button onMouseOver={handleOnMouseOver} className={`${styles['btn']} ${styles['btn-stop']}`} onClick={handleStop}>Stop</button>
                    <button onMouseOver={handleOnMouseOver} className={`${styles['btn']} ${styles['btn-reset']}`} onClick={handleReset}>Reset</button>
                    <span className="material-symbols-outlined">
                        volume_mute
                    </span>
                    <input value={backgroundMusicVolume.current} onChange={handleVolumeChange} type="range" />
                    <span className="material-symbols-outlined">
                        volume_up
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Stopwatch;
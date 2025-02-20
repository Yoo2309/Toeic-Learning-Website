import speaker_gif from "../../assets/icons8-speaker.gif";
import React, { useEffect, useState } from "react";
import { useSpeechSynthesis } from "react-speech-kit";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";

const VocabularySlider = ({ words }) => {
  const [play_pronun, setPlay_pronun] = useState(false);
  const onEnd = () => {
    setPlay_pronun(false);
  };
  const { speak } = useSpeechSynthesis({ onEnd });

  const [currentSlide, setCurrentSlide] = useState(0);
  const slideLength = words.length;

  const nextSlide = () => {
    setCurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

  // State to detect mobile
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Adjust the width based on your breakpoint
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Initial check

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Swipe detection
  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    touchEndX = e.changedTouches[0].clientX;
    handleSwipeGesture();
  };

  const handleSwipeGesture = () => {
    if (touchEndX > touchStartX) {
      nextSlide();
    } else if (touchEndX < touchStartX) {
      prevSlide();
    }

    touchStartX = 0;
    touchEndX = 0;
  };

  return (
    <p
      className="slider"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {!isMobile && (
        <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      )}
      {!isMobile && (
        <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
      )}
      {words.map((word, index) => {
        return (
          <div
            key={word.idVoc}
            className={`slide ${
              index === currentSlide
                ? "current"
                : index === currentSlide - 1
                ? "pre-slide"
                : "next-slide"
            }`}
          >
            <label>
              <input type="checkbox" />
              <div className="flip-card">
                <div className="front">
                  <div className="eng-word">{word.engWord}</div>
                  <div className="back-item">{`(${word.wordType})`}</div>
                  <div>
                    <hr />
                    <p className="flip">Click để lật</p>
                  </div>
                </div>
                <div className="back">
                  <div style={{ fontWeight: "bold", fontStyle: "italic" }}>
                    {word.engWord}
                  </div>
                  <hr />
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "5px",
                      }}
                    >
                      <div
                        className="back-item"
                        style={{ fontStyle: "italic" }}
                      >
                        {word.pronunciation ?? "pronunciation"}
                      </div>
                      <img
                        width="24"
                        height="24"
                        src={
                          play_pronun
                            ? speaker_gif
                            : "https://img.icons8.com/material-sharp/24/speaker.png"
                        }
                        alt="speaker"
                        onClick={(e) => {
                          e.preventDefault();
                          setPlay_pronun(true);
                          speak({
                            text: word.engWord ?? "pronunciation",
                          });
                        }}
                      />
                    </div>
                    <div className="back-item">Ý nghĩa: {word.meaning}</div>
                    <div className="back-item">{word.example}</div>
                  </div>
                  <hr />
                  <p className="flip">Click để lật</p>
                </div>
              </div>
            </label>
          </div>
        );
      })}
    </p>
  );
};

export default VocabularySlider;

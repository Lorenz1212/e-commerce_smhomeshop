import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./DealTimer.css";

const DealTimer = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [timeLeft, setTimeLeft] = useState({
    days: 31,
    hours: 29,
    minutes: 57,
    seconds: 17,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTimeLeft) => {
        const { days, hours, minutes, seconds } = prevTimeLeft;
        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
          clearInterval(timer);
          return prevTimeLeft;
        }
        let newSeconds = seconds - 1;
        let newMinutes = minutes;
        let newHours = hours;
        let newDays = days;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }
        if (newHours < 0) {
          newHours = 23;
          newDays -= 1;
        }

        return {
          days: newDays,
          hours: newHours,
          minutes: newMinutes,
          seconds: newSeconds,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (value:any) => {
    return value.toString().padStart(2, "0");
  };

  return (
    <>
      <div className="mainDeal">
        <div className="dealTimer">
          <div className="dealTimerMainContent">
            <div className="dealTimeContent">
              <p>Live Beautifully</p>
              <h3>
                Style Up 
                <span> Your Space</span>
              </h3>
              <span>
                Furnish your space with pieces that reflect your lifestyle.<br/>
                From essentials to statement pieces — SM Home has it all.
              </span>
              <div className="dealTimeLink">
                <Link to="/shop/all" onClick={scrollToTop}>
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="dealTimeCounter">
              {/* <div className="dealTimeDigit">
                <h4>{timeLeft.days}</h4>
                <p>Days</p>
              </div>
              <h4>:</h4>
              <div className="dealTimeDigit">
                <h4>{timeLeft.hours}</h4>
                <p>Hours</p>
              </div>
              <h4>:</h4>
              <div className="dealTimeDigit">
                <h4>{formatTime(timeLeft.minutes)}</h4>
                <p>Minutes</p>
              </div>
              <h4>:</h4>
              <div className="dealTimeDigit">
                <h4>{formatTime(timeLeft.seconds)}</h4>
                <p>Seconds</p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default DealTimer;

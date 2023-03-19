import React from "react";

function TimerComponent() {
  const [time, setTime] = React.useState(0);
  console.log("Component Update");

  React.useEffect(function () {
    setTime(time + 1);
  }, []);

  return (
    <div>
      <h3>{time} Second</h3>
      <button>1ずつ上げてください。</button>
    </div>
  );
}

export default TimerComponent;

import settings from "../engine/settings.json";

let scrollInterval: number;

function mouseScroll(event: React.MouseEvent) {
  if (event.target instanceof HTMLDivElement) {
    clearInterval(scrollInterval);
    switch (event.target.id) {
      case "top":
        scrollInterval = setInterval(() => {
          window.scrollBy({
            top: settings["arena-height"] / -100,
            behavior: "smooth",
          });
        }, 1000 / settings["fps"]);
        break;
      case "right":
        scrollInterval = setInterval(() => {
          window.scrollBy({
            left: settings["arena-height"] / 100,
            behavior: "smooth",
          });
        }, 1000 / settings["fps"]);
        break;
      case "bottom":
        scrollInterval = setInterval(() => {
          window.scrollBy({
            top: settings["arena-height"] / 100,
            behavior: "smooth",
          });
        }, 1000 / settings["fps"]);
        break;
      case "left":
        scrollInterval = setInterval(() => {
          window.scrollBy({
            left: settings["arena-height"] / -100,
            behavior: "smooth",
          });
        }, 1000 / settings["fps"]);
        break;
    }
  }
}

function stopMouseScroll() {
  clearInterval(scrollInterval);
}

function MouseScrollOverlay() {
  return (
    <>
      <div
        id="top"
        className="fixed top-0 left-0 w-full h-8 hover:cursor-n-resize"
        onMouseEnter={(event) => mouseScroll(event)}
        onMouseLeave={stopMouseScroll}
      ></div>
      <div
        id="right"
        className="fixed top-0 right-0 w-8 h-full hover:cursor-e-resize"
        onMouseEnter={(event) => mouseScroll(event)}
        onMouseLeave={stopMouseScroll}
      ></div>
      <div
        id="bottom"
        className="fixed bottom-0 left-0 w-full h-8 hover:cursor-s-resize"
        onMouseEnter={(event) => mouseScroll(event)}
        onMouseLeave={stopMouseScroll}
      ></div>
      <div
        id="left"
        className="fixed top-0 left-0 w-8 h-full hover:cursor-w-resize"
        onMouseEnter={(event) => mouseScroll(event)}
        onMouseLeave={stopMouseScroll}
      ></div>
    </>
  );
}

export default MouseScrollOverlay;

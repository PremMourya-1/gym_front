export default function disableInspect() {
  document.addEventListener("keydown", (event) => {
    if (
      event.key === "F12" ||
      (event.ctrlKey && event.shiftKey && event.key === "c") ||
      (event.ctrlKey && event.shiftKey && event.key === "C") ||
      (event.ctrlKey && event.shiftKey && event.key === "I") ||
      (event.ctrlKey && event.shiftKey && event.key === "i") ||
      (event.ctrlKey && event.key === "U") ||
      (event.ctrlKey && event.key === "u")
    ) {
      event.preventDefault();
    }
  });

  document.addEventListener("contextmenu", (event) => event.preventDefault());
}

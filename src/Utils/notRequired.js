export default function notRequiredInput(e) {
  e.target.nextElementSibling.classList.add("editLabel");
}

function inputBlur(e) {
  if (!e.target.value) {
    e.target.nextElementSibling.classList.remove("editLabel");
  }
}

export { inputBlur };

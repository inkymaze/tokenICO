let clickCount = 0;

function moreInfoModal() {
  if (clickCount === 0) {
    clickCount += 1;
    document.getElementById("moreinfo").show();
  } else {
    clickCount = 0;
    document.getElementById("moreinfo").close();
}
}


function closeModal() {
  document.getElementById("moreinfo").close();
}

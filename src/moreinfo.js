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

//
// <script>
// // When the user clicks on <div>, open the popup
// function myFunction() {
//     var popup = document.getElementById("myPopup");
//     popup.classList.toggle("show");
// }
// </script>

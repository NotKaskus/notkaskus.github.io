// Dark mode icon
function switch_dark_mode_icon(darkmode, id) {
  darkmode.toggle();
  render_dark_mode_icon(darkmode, id);
}

function render_dark_mode_icon(darkmode, id) {
  var x = document.getElementsByTagName("img");
  var i;

  console.log(x);
  if (darkmode.isActivated()) {
    document.getElementById(id).classList.remove("bru");
    document.getElementById(id).classList.add("bru");
    for (i = 0; i < x.length; i++) {
      x[i].style["mix-blend-mode"] = "difference";
    }
  } else {
    document.getElementById(id).classList.remove("bru");
    document.getElementById(id).classList.add("bru");
    console.log(id)
    for (i = 0; i < x.length; i++) {
      x[i].style["mix-blend-mode"] = "normal";
    }
  }
}

// Modal link
$(document).ready(function() {
    $(window.location.hash).modal('show');
});
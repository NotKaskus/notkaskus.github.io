var cursor = document.querySelector('.cursor');
var cursorinner = document.querySelector('.cursor2');
var a = document.querySelectorAll('a');
var isCursorVisible = true;
var idleTimeout;
var fadeTimeout;

function showCursor() {
  if (!isCursorVisible) {
    cursor.style.display = 'block';
    cursorinner.style.display = 'block';
    cursor.style.opacity = '1'; // Reset opacity
    cursorinner.style.opacity = '.3'; // Reset opacity
    isCursorVisible = true;
  }
  clearTimeout(idleTimeout);
  clearTimeout(fadeTimeout);
  idleTimeout = setTimeout(hideCursor, 5000);
}

function hideCursor() {
  if (isCursorVisible) {
    cursor.style.opacity = '0'; // Apply fading animation to cursor
    cursorinner.style.opacity = '0'; // Apply fading animation to cursorinner
    fadeTimeout = setTimeout(function() {
      cursor.style.display = 'none';
      cursorinner.style.display = 'none';
    }, 300); // Wait for the animation to complete before hiding the cursor
    isCursorVisible = false;
  }
}

function checkDeviceHasMouse() {
  return matchMedia('(pointer:fine)').matches;
}

document.addEventListener('mousemove', function(e) {
  if (checkDeviceHasMouse()) {
    showCursor();
    var x = e.clientX;
    var y = e.clientY;
    cursor.style.transform = `translate3d(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%), 0)`;
    cursorinner.style.left = x + 'px';
    cursorinner.style.top = y + 'px';
  } else {
    hideCursor();
  }
});

document.addEventListener('mousedown', function() {
  showCursor();
  cursor.classList.add('click');
  cursorinner.classList.add('cursorinnerhover');
});

document.addEventListener('mouseup', function() {
  showCursor();
  cursor.classList.remove('click');
  cursorinner.classList.remove('cursorinnerhover');
});

a.forEach(item => {
  item.addEventListener('mouseover', () => {
    showCursor();
    cursor.classList.add('hover');
  });
  item.addEventListener('mouseleave', () => {
    showCursor();
    cursor.classList.remove('hover');
  });
});

hideCursor(); // Initially hide the cursor

document.addEventListener('keydown', function() {
  showCursor();
});

document.addEventListener('scroll', function() {
  showCursor();
});

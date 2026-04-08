const divs = Array.from(document.getElementsByTagName('div'));

divs.forEach((div) => {
  div.addEventListener('click', (event) => {
    event.stopPropagation();
    alert(`ELEMEN ${div.getAttribute('id').toUpperCase()}`);
  });
});

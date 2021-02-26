$(document).ready(function () {
  $("div.letter").show(0).hide(0).delay(500).fadeIn(1500);

  animateLetter(".p", 0);
  animateLetter(".o", 0);
  animateLetter(".s", 0);
  animateLetter(".a", 0);
  animateLetter(".o-2", 0);

  setTimeout(function () {
    //Koristimo nestovani loop gde proveravamo svaku mogucu kombinaciju slova koja mogu da se preklope, bez duplikata
    //Ako funkcija checkCollision vrati true, strana ce se reload-ovati i igra ce krenuti iz pocetka
    let letArr = $(".letter").toArray();

    for (let i = 0; i < letArr.length - 1; i++) {
      for (let j = i + 1; j < letArr.length; j++) {
        if (checkCollision(letArr[i], letArr[j])) {
          $(letArr[i]).addClass("alert");
          $(letArr[j]).addClass("alert");

          location.reload();
        }
      }
    }

    //Set-ujemo counter varijablu da bi nam setInterval vratio ID koji nam sluzi da bi clear-ovali Timer.
    let counter = setInterval(timer, 1000);
    let count;

    //Setujemo count varijablu zavisno od sirine ekrana
    if ($(window).width() < 769) {
      count = 6;
    } else {
      count = 5;
    }

    timer();

    checkLettersOrderOnClick();

    //Timer funckija koja ce biti pozivana svake ~sekunde i decrement-ovati count varijablu sve dok ne bude dosla do nude gde clear-ujemo timer.
    //Kada timer istekne, proveravamo da li popup ima klasu open i ako da, menjamo text u popupu.
    //Update-ujemo DOM da representuje time counter.
    function timer() {
      count = count - 1;

      if (count <= 0) {
        clearInterval(counter);
        if (!$(".overlay").hasClass("open")) {
          $(".overlay h1").html("Isteklo vreme... :/");
          $(".overlay").css({ display: "flex" });
          $("#new_game").click(function () {
            location.reload();
          });
        }
        return;
      }
      $(".time-counter").html(count);
    }
  }, 4000);
});

//Funkcija koja uzima dimenzije minus aproksimativne respekcivne dimenzije slova i onda koristeci random number generator vraca niz koji sadrzi nove koordinate
function calcNewPosition() {
  let lHeight = $(window).height() - 100;
  let lWidth = $(window).width() - 50;

  let nlh = Math.floor(Math.random() * lHeight);
  let nlw = Math.floor(Math.random() * lWidth);

  return [nlh, nlw];
}

//Funkcija koja nam sluzi da animiramo slova koristeci CSS klasu i broj puta koliko zelimo da pozovemo pomenutu funkciju rekurzovno
//Ako je broj jedan jedinici znaci da smo animirali slovo od stare do nove pozicije koristeci koordinate dobijene pozivanje calcNewPosition funkcije, sto znaci da treba da prekinemo povanje funkcije
function animateLetter(cssClass, num) {
  if (num === 1) return;

  let newQoords = calcNewPosition();

  $(cssClass).animate(
    { top: newQoords[0], left: newQoords[1] },
    1000,
    "swing",
    function () {
      animateLetter(cssClass, num + 1);
    }
  );
}

//Inicijalizujemo dva niza, jedan je target koji sadrzi sva slova a drugi niz je prazan koji sluzi da u njega ubacimo slovo na koje kliknemo
//Loop-ujemo kroz slova i dodajemo klik event listener-e na svako slovo
//Na klik ubacujemo slovo u niz i onda proveravamo da li string od target niza sadrzi string od niza dobijenog kliktanjem
//i da li je index kliknutog slova isti kao i index slova koje je po redu u target nizu...u suprotnom nesto ne valja i idemo na reload stranice
//Ako kliknemo sve kako treba, kao stop uslov proverimo da li se poklapaju duzine nizova i ako da, prikazemo popup
function checkLettersOrderOnClick() {
  let targetArr = ["P", "O", "S", "A", "O"];
  let clickedArr = [];

  $(".letter").each(function () {
    $(this).click(function () {
      clickedArr.push($(this).text());

      if (
        targetArr.join("").includes(clickedArr.join("")) &&
        clickedArr.indexOf($(this).text()) === targetArr.indexOf($(this).text())
      ) {
        $(this).addClass("success");
        if (targetArr.join("").length === clickedArr.join("").length) {
          $(".overlay").css({ display: "flex" });
          $(".overlay").addClass("open");
          $(".time-counter").css({ display: "none" });
          $("#new_game").click(function () {
            location.reload();
          });
        }
      } else {
        $(this).css({ color: "#FF3E41" });
        location.reload();
      }
    });
  });
}

//Funckija koja proverava da li postoji preklapanje dva pravougaonika koristeci 2d collision detection algoritam
//https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
function checkCollision(rect1, rect2) {
  first = rect1.getBoundingClientRect();
  second = rect2.getBoundingClientRect();

  if (
    first.left < second.left + $(rect2).width() &&
    first.left + $(rect1).width() > second.left &&
    first.top < second.top + $(rect2).height() &&
    first.top + $(rect1).height() > second.top
  ) {
    return true;
  } else {
    return false;
  }
}

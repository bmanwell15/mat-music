/*
  IMPORTANT NUMBERS:
    - 16: Number of notes in a measure
    - 6: number of measures
    - 96 (16*6): Number of total note objects
*/
var song = [ // song (.length == 6)
//   [  measure (.length == 16)
  
//   ]
]

var AUDIO = {
  bass: new Audio("https://cdn.glitch.global/b39e794e-3a29-42a3-9fc5-bf4b4da07c1f/Bass Sound.mp3?v=1674775011885"),
  snare: new Audio("https://cdn.glitch.global/b39e794e-3a29-42a3-9fc5-bf4b4da07c1f/Snare Sound?v=1674774799985"),
  highHat: new Audio("https://cdn.glitch.global/b39e794e-3a29-42a3-9fc5-bf4b4da07c1f/high-hat_fgce5awO.mp3?v=1678899739097"),
  susCym: new Audio("https://cdn.glitch.global/b39e794e-3a29-42a3-9fc5-bf4b4da07c1f/Sus%20Cym.mp3?v=1674774506268")
}

var tempo = document.getElementById("tempo").value
var playSongPosition = 0; // When their song is being played, which beat they are on
var stopSongState = false;
var noteId = 0;
var cloud_refresh;

document.getElementById("tempo").addEventListener("change", () => {
  tempo = document.getElementById("tempo").value
  
  // Three equations that describe the behavior of the colors
  const r = 1.41*(tempo - 10);
  const g = 189 - 0.0625*((tempo - 88)**2);
  const b = 255 - 3*(tempo - 60);
  
  document.getElementById("tempo").style.backgroundColor = "rgb(" + r + "," + g + "," + b + ")"
});


var musicBar = 1;
for (var i = 0; i < 6;i++) { // for each measure
  song.push(new Array())
  musicBar = i > 2 ? 2 : 1;
  
  musicBar == 1 ? $("#musicBar1").prepend(`<div class="measure" id="measure-` + i + `" style="left:` + (12 + (i)*29) + `%;width: 29%"></div>`) : $("#musicBar2").prepend(`<div class="measure" id="measure-` + i + `" style="left:` + ((i-3)*33) + `%;width:33%"></div>`)
  
  for (var k = 0;k < 16;k++) { // for each 16th note beat in each measure
      song[i].push(new Note(0, i, k))
  }
  // add a quarter note on every beat in each measure
  song[i][0].duration = 0.25
  song[i][4].duration = 0.25
  song[i][8].duration = 0.25
  song[i][12].duration = 0.25
  
  for (var k = 0;k < 16;k++) {song[i][k].update()} // Update the notes in each measure
}

setInterval(() => {if (eval(cloud_refresh)) {location.reload()}}, 5000) // Prompt for auto-refresh

// When the user clicks the play button, check if the song is able to be played and reset if necessary
function checkPlaySong() {
  if (($getForInterval() == 0 || $getForInterval() == 96) && !stopSongState) {$forInterval("playSong()", 96, 60000/(4*tempo), 0)} else {stopSong()}
}

function stopSong() {
  if (!stopSongState && forIntervali < 95) {
    stopSongState = true
    forIntervali = 95 // Stop running the Circumvent.js $forInterval() function
  } else {
    stopSongState = false
  }
}

function playSong() {
  if (!stopSongState) {
    var currentNote = song[Math.floor($getForInterval()/16)][$getForInterval()%16]
    var noteColor = currentNote.backgroundColor

    if ($getForInterval() != 0) {$("#note-" + ($getForInterval()-1)).animate({backgroundColor: noteColor.replace(/[^,]+(?=\))/, 0.1)})}
    $("#note-" + $getForInterval()).animate({backgroundColor: noteColor.replace(/[^,]+(?=\))/, 0.3)})

    if (currentNote.bass) {AUDIO.bass.pause();AUDIO.bass.currentTime = 0;AUDIO.bass.play()}
    if (currentNote.snare) {AUDIO.snare.pause();AUDIO.snare.currentTime = 0;AUDIO.snare.play()}
    if (currentNote.highHat) {AUDIO.highHat.pause();AUDIO.highHat.currentTime = 0;AUDIO.highHat.play()}
    if (currentNote.susCym) {AUDIO.susCym.pause();AUDIO.susCym.currentTime = 0;AUDIO.susCym.play()}
  }
  if ($getForInterval() >= 95) {
    stopSongState = false
    for (var i = 0;i < 96;i++) { // Makes sure all background colors of the measures have the low opacity background
      var reset_currentNote = song[Math.floor(i/16)][i%16]
      var reset_noteColor = reset_currentNote.backgroundColor
      $("#note-" + i).animate({backgroundColor: reset_noteColor.replace(/[^,]+(?=\))/, 0.1)})
    }
  }
}


/*
  Note object
  type - double. Signifies the length and type of each note (quarter, 8th, 16). Value must be between 0-1 (Quarter note == 0.25)
  measure - which measure does this note belong to
  beat - where in the measure the note belongs
    { In each measure:
      Beats              : 1 - e - and - a   2 - e - and - a   3 - e - and - a   4 - e - and - a
      Array (of var song): 0   1    2    3   4   5    6    7   8   9   10   11  12  13   14   15
    }
*/
function Note(type, measure, beat) {
  this.duration = type
  this.id = noteId
  this.measure = measure
  this.beat = beat
  this.backgroundColor;
  
  this.bass = false;
  this.snare = false;
  this.highHat = false;
  this.suscym = false;
  
  $("#measure-" + this.measure).append(`
    <div class="musicNoteContainer" id="note-`+ this.id + `">
      <div class="restCircle" id="susCym-`+ this.id + `"><div class="susCymMarker" id="susCymMarker-` + this.id + `"></div></div>
      <div class="restCircle" id="highHat-`+ this.id + `"><div class="highHatMarker" id="highHatMarker-` + this.id + `"></div></div>
      <div class="restCircle" id="snare-`+ this.id + `"><div class="snareMarker" id="snareMarker-` + this.id + `"></div></div>
      <div class="restCircle" id="bass-`+ this.id + `"><div class="bassMarker" id="bassMarker-` + this.id + `"></div></div>
      <select class="selectNoteLength" id="selectNoteLength-`+ this.id + `">
        <option value="0.25">1/4</option>
        <option value="0.125">1/8</option>
        <option value="0.0625">1/16</option>
      </select>
    </div>
  `)
  
  this.DOM = document.getElementById("note-" + this.id)
  
  // Slight background colors to dipict what beat this note is on
  if (this.beat < 4) {
    this.backgroundColor = "rgba(0,200,0,0.1)"
  } else if (this.beat < 8) {
    this.backgroundColor = "rgba(0,0,200,0.1)"
  } else if (this.beat < 12) {
    this.backgroundColor = "rgba(200,0,0,0.1)"
  } else if (this.beat < 16) {
    this.backgroundColor = "rgba(200,200,0,0.1)"
  }
  
  this.DOM.style.backgroundColor = this.backgroundColor
  
  document.getElementById("note-" + this.id).addEventListener("mouseenter", () => {
    document.getElementById("selectNoteLength-" + this.id).style.opacity = 1
  });
  document.getElementById("note-" + this.id).addEventListener("mouseleave", () => {
    document.getElementById("selectNoteLength-" + this.id).style.opacity = 0.2
  });
  
  document.getElementById("selectNoteLength-" + this.id).addEventListener("mouseenter", (event) => {
    var count = 0;
    for (var i = 0;i < 16;i++) {if (song[this.measure][i].duration != 0) {count++}} // find out how many notes are in a measure
    if (count > 8) { // if there are more than 8 notes in the measure, then show the box
      document.getElementById("selectNoteLengthHoverBox").innerHTML = "1/" + Number(this.duration)**-1
      document.getElementById("selectNoteLengthHoverBox").style.top = (event.clientY + 4) + "px";
      document.getElementById("selectNoteLengthHoverBox").style.left = (event.clientX + 4) + "px";
      document.getElementById("selectNoteLengthHoverBox").style.display = "block"
    }
  });
  
  document.getElementById("selectNoteLength-" + this.id).addEventListener("mouseleave", () => {document.getElementById("selectNoteLengthHoverBox").style.display = "none"})
  
  // Wait for a user to click one of the gray circles
  document.getElementById("snare-" + this.id).addEventListener("mouseup", () => {
    this.snare = !this.snare;
    if (this.snare) {
      AUDIO.snare.pause();
      AUDIO.snare.currentTime = 0;
      AUDIO.snare.play()
    }
    this.update()
  });
  document.getElementById("bass-" + this.id).addEventListener("mouseup", () => {
    this.bass = !this.bass;
    if (this.bass) {
      AUDIO.bass.pause();
      AUDIO.bass.currentTime = 0;
      AUDIO.bass.play()
    }
    this.update()
  });
  document.getElementById("highHat-" + this.id).addEventListener("mouseup", () => {
    this.highHat = !this.highHat;
    if (this.highHat) {
      AUDIO.highHat.pause();
      AUDIO.highHat.currentTime = 0;
      AUDIO.highHat.play()
    }
    this.update()
  });
  document.getElementById("susCym-" + this.id).addEventListener("mouseup", () => {
    this.susCym = !this.susCym;
    if (this.susCym) {
      AUDIO.susCym.pause();
      AUDIO.susCym.currentTime = 0;
      AUDIO.susCym.play()
    }
    this.update()
  });
  
  // If the user changes the duration of one of the music notes, update it
  document.getElementById("selectNoteLength-" + this.id).addEventListener("change", () => {
    this.duration = Number(eval(document.getElementById("selectNoteLength-" + this.id).value))
    
    // Applies basic music rules (there must be two 8th notes in a beat, etc...)
    /*
    Beats: 1 - e - and - a   2 - e - and - a   3 - e - and - a   4 - e - and - a
    Array: 0   1    2    3   4   5    6    7   8   9   10   11  12  13   14   15
    */
    for (var i = 0;i < 16;i+=4) { // for every downbeat...
      if (song[this.measure][i].duration == 0.125/*   1/8   */) {
        song[this.measure][i+1].duration = 0
        if (song[this.measure][i+2].duration != 0.0625) {song[this.measure][i+2].duration = 0.125}
        song[this.measure][i+3].duration = 0
      }
      if (song[this.measure][i].duration == 0.25/*   1/4   */) {
        song[this.measure][i+1].duration = 0
        song[this.measure][i+2].duration = 0
        song[this.measure][i+3].duration = 0
      }
      if (song[this.measure][i+2].duration == 0.25) {song[this.measure][i+2].duration = 0.125}
      
     // If the user tries to set a quarter or 8th note on a 16th beat
     if (song[this.measure][i+3].duration == 0.25 || song[this.measure][i+3].duration == 0.0125) {song[this.measure][i+3].duration = 0.0625}
     if (song[this.measure][i+1].duration == 0.25 || song[this.measure][i+1].duration == 0.0125) {song[this.measure][i+1].duration = 0.0625}
    }
    
    for (var i = 0;i < 16;i+=2) { // for every 8th note
      if (song[this.measure][i].duration == 0.0625/*   1/16   */) {
        song[this.measure][i+1].duration = 0.0625
        if (i < 14 && song[this.measure][i+2].duration == 0) {song[this.measure][i+2].duration = 0.0625} else
        if (i >= 14 && song[this.measure][15].duration == 0) {song[this.measure][15].duration = 0.0625}
      }
      // If there is an 8th note, then there is not a 16th note following it
      if (song[this.measure][i].duration == 0.125) {song[this.measure][i+1].duration = 0}
      
      // if there is a 8th note on the beat of the 16th
      if (song[this.measure][i+1].duration == 0.125/*   1/8   */) {
        song[this.measure][i+1].duration = 0.0625
      }
    }
    
    for (var i = 0;i < 96;i++) {song[Math.floor(i/16)][i%16].update()}
    
  }); // END note change event listener
  
  noteId++
  
  
  this.update = () => {
    if (this.duration != 0) {
      document.getElementById("selectNoteLength-" + this.id).title = "1/" + (this.duration**-1)
      this.DOM.style.display = "block"
    } else {
      this.DOM.style.display = "none"
      this.bass = false;
      this.snare = false;
      this.highHat = false;
      this.susCym = false;
    }
    document.getElementById("selectNoteLength-" + this.id).value = this.duration
    
    document.getElementById("bassMarker-" + this.id).style.display = this.bass ? "block" : "none"
    document.getElementById("bass-" + this.id).style.backgroundColor = this.bass ? "rgb(255,150,150)" : "rgb(182,182,182)"
    document.getElementById("snareMarker-" + this.id).style.display = this.snare ? "block" : "none"
    document.getElementById("snare-" + this.id).style.backgroundColor = this.snare ? "rgb(255,255,100)" : "rgb(182,182,182)"
    document.getElementById("highHatMarker-" + this.id).style.display = this.highHat ? "block" : "none"
    document.getElementById("highHat-" + this.id).style.backgroundColor = this.highHat ? "rgb(70,230,70)" : "rgb(182,182,182)"
    document.getElementById("susCymMarker-" + this.id).style.display = this.susCym ? "block" : "none"
    document.getElementById("susCym-" + this.id).style.backgroundColor = this.susCym ? "rgb(0,200,255)" : "rgb(182,182,182)"
    
    // Change the size of the circles according to the note length (16th notes are smaller than Quarters)
    
    // Equations created by DESMOS to describe the relationship between note duration and note size (f(x) = a(x**b) + c)
    var circleSize = (x) => {return -3.7811*(x**-0.479315) + 32.3291}
    var circleMargin = (x) => {return 48.2392*(x**-0.0755089) - 43.5429}
    
    var circles = document.querySelector("#note-" + this.id).querySelectorAll(".restCircle")
    for (var i = 0;i < circles.length;i++) {
      circles[i].style.width = circleSize(this.duration) + "px"
      circles[i].style.height = circleSize(this.duration) + "px"
      circles[i].style.margin = circleMargin(this.duration) + "px auto"
    }
    
  } // END this.update()
  
  
  this.toString = () => {
    if (this.duration != 0) {return Number(this.duration)**-1 + "th Note"}
    return 0;
  }
}
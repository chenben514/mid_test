//selecting all required elements
let timeValue = 120;
let curTimeValue = timeValue;
const quizHeader = document.querySelector(".quiz_box");
const quizHeaderWidth = parseInt(quizHeader.offsetWidth, 10);

const start_btn = document.querySelector(".start_btn button");
const quiz_box = document.querySelector(".quiz_box");
const result_box = document.querySelector(".result_box");
const option_list = document.querySelector(".option_list");
const select_list = document.querySelector(".select_list");
const correct_list = document.querySelector(".correct_list");
const time_line = document.querySelector("header .time_line");
const timeText = document.querySelector(".timer .time_left_txt");
const timeCount = document.querySelector(".timer .timer_sec");
timeCount.textContent = timeValue;

// if startQuiz button clicked
start_btn.onclick = () => {
  quiz_box.classList.add("activeQuiz"); //show quiz box
  getQuestions();
  showQuetions(0); //calling showQestions function
  queCounter(1); //passing 1 parameter to queCounter
  startTimer(); //calling startTimer function
  startTimerLine(); //calling startTimerLine function
};

let que_count = 0;
let que_numb = 1;
let userScore = 0;
let counter;
let counterLine;
let nowCursorFocus = 0;
let curQuesType = "";

const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .quit");

// if restartQuiz button clicked
restart_quiz.onclick = () => {
  quiz_box.classList.add("activeQuiz"); //show quiz box
  result_box.classList.remove("activeResult"); //hide result box
  que_count = 0;
  que_numb = 1;
  userScore = 0;
  showQuetions(que_count); //calling showQestions function
  queCounter(que_numb); //passing que_numb value to queCounter
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  startTimer(); //calling startTimer function
  startTimerLine(); //calling startTimerLine function
  timeText.textContent = "還剩"; //change the text of timeText to Time Left
  next_btn.classList.remove("show"); //hide the next button
};

// if quitQuiz button clicked
quit_quiz.onclick = () => {
  window.location.reload(); //reload the current window
};

const next_btn = document.querySelector("footer .next_btn");
const bottom_ques_counter = document.querySelector("footer .total_que");

// if Next Que button clicked
next_btn.onclick = () => {
  if (que_count < questions.length - 1) {
    //if question count is less than total question length
    que_count++; //increment the que_count value
    que_numb++; //increment the que_numb value
    showQuetions(que_count); //calling showQestions function
    queCounter(que_numb); //passing que_numb value to queCounter
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    startTimer(); //calling startTimer function
    startTimerLine(); //calling startTimerLine function
    timeText.textContent = "還剩"; //change the timeText to Time Left
    next_btn.classList.remove("show"); //hide the next button
  } else {
    clearInterval(counter); //clear counter
    clearInterval(counterLine); //clear counterLine
    showResult(); //calling showResult function
  }
};

function getQuestions() {
  //ben_test
  var selCategory = document.getElementById("category").value;
  var selLevel = document.getElementById("level").value;
  var selFile = "./data/" + selCategory + "_" + selLevel + ".csv";
  if (selLevel.includes("zhuyin")) curQuesType = "direct_input";

  var read = new XMLHttpRequest();
  read.open("GET", selFile, false);
  read.setRequestHeader("Cache-Control", "no-cache");
  read.send();
  var displayName = read.responseText;
  var quesArr = displayName.replace(/\r\n/g, "\n").split("\n");
  var quesList = [];
  let quesCnt = quesArr.length;
  let ansList = [];
  let tmpCnt = 0;

  let tmpArr = [];
  let k = 0;
  for (let k = 0; k < quesCnt; k++) {
    if (quesArr[k].length > 1) tmpArr.push(quesArr[k]);
  }
  quesArr = tmpArr;
  quesCnt = quesArr.length;

  //1.get random list from file
  while (quesList.length < quesCnt) {
    var r = Math.floor(Math.random() * quesCnt);
    if (quesList.indexOf(r) === -1) quesList.push(r);
  }

  class Question {
    numb;
    question;
    answer;
    option1;
    option2;
    option3;
    option4;
    direct_answers = [];
  }
  //2.generate questions
  questions = [];
  var i;
  var j;
  for (i = 0; i < quesCnt; i++) {
    var singQuesArr = quesArr[quesList[i]].split(";");
    let question = new Question();
    question.numb = i + 1;
    question.question = singQuesArr[0];
    question.answer = singQuesArr[1];
    ansList = [];
    while (ansList.length < 4) {
      var r = Math.floor(Math.random() * 4) + 1;
      if (ansList.indexOf(r) === -1) ansList.push(r);
    }
    question.option1 = singQuesArr[ansList[0]];
    question.option2 = singQuesArr[ansList[1]];
    question.option3 = singQuesArr[ansList[2]];
    question.option4 = singQuesArr[ansList[3]];
    question.category = singQuesArr[2];
    questions[i] = question;
  }
}

function UrlExists(url) {
  var http = new XMLHttpRequest();
  http.open("HEAD", url, false);
  http.send();
  return http.status != 404;
}

function pronClick() {
  var mp3File = "./audio/" + questions[que_count].question;
  if (UrlExists(mp3File)) {
    var audio = new Audio(mp3File);
    audio.play();
  } else {
    var msg = new SpeechSynthesisUtterance();

    // Set the text.
    msg.text = questions[que_count].question.replace(".mp3", "");

    // Set the attributes.
    msg.volume = 1;
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  }
  // alert(mp3File);
  // try {
  //   var audio = new Audio(mp3File);
  //   if (isNaN(sound.duration)) alert("Do something");
  //   audio.play();
  // } catch {
  //   alert("no file:" + mp3File);
  //   var msg = new SpeechSynthesisUtterance();

  //   // Set the text.
  //   msg.text = questions[que_count].question.replace(".mp3", "");

  //   // Set the attributes.
  //   msg.volume = 1;
  //   msg.rate = 1;
  //   msg.pitch = 1;
  //   window.speechSynthesis.speak(msg);
  // }

  // If a voice has been selected, find the voice and set the
  // utterance instance's voice attribute.
  /*
  if (voiceSelect.value) {
    msg.voice = speechSynthesis.getVoices().filter(function (voice) {
      return voice.name == voiceSelect.value;
    })[0];
  }
*/
  // Queue this utterance.
  // window.speechSynthesis.speak(msg);
}

function confirmClick() {
  let inputAnswer = document.querySelector(".direct_input").value;
  let correctAnswer = "";
  if (curQuesType === "direct_input") {
    correctAnswer = questions[que_count].answer;
  } else {
    correctAnswer = questions[que_count].question.replace(".mp3", "");
  }

  if (inputAnswer.replace(" ", "") === correctAnswer.replace(" ", ""))
    directSelected("correct");
  else directSelected("incorrect");

  //   document.querySelector(".target" + String(j)).innerText !==
  //   questions[index].direct_answers[j]
  // ) {
  //   answer_result = false;
  // }
}

// getting questions and options from array
function showQuetions(index) {
  const que_text = document.querySelector(".que_text");
  correct_list.innerHTML = "";
  curTimeValue = timeValue;

  nowCursorFocus = 0;
  //creating a new span and div tag for question and option and passing the value using array index
  let que_tag =
    "<span>" +
    // questions[index].numb +
    // ". " +
    questions[index].question +
    "</span>";
  if (questions[index].question.includes(".mp3")) {
    que_tag =
      "<span> 請按右邊發音鈕  <button onclick='pronClick()' class='pronButton' style='width:70px;height:40px;' >發音</button></span>";
    que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  }

  let option_tag =
    '<div class="option"><span>' +
    questions[index].option1 +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].option2 +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].option3 +
    "</span></div>" +
    '<div class="option"><span>' +
    questions[index].option4 +
    "</span></div>";
  let confirm_button = "";

  que_text.innerHTML = que_tag; //adding new span tag inside que_tag
  if (questions[index].category != undefined) {
    // curQuesType = "option";
    option_list.innerHTML = option_tag; //adding new div tag inside option_tag
  } else if (
    questions[index].question.includes(".mp3") ||
    curQuesType.includes("direct_input")
  ) {
    let answer_target =
      '<div><input type="text" class="direct_input" name="direct_input" id="direct_input" value="" placeholder="輸入答案" style="width:40%;height:40px;font-size:20px;padding:10px;">';
    answer_target +=
      "<span> <button onclick='confirmClick()' style='width:70px;height:40px;' >確認</button></span> </div>";
    curQuesType = "direct_input";
    option_list.innerHTML = answer_target;
  } else {
    // curQuesType = "direct";
    let answer_target = '<div class="option">';
    let answer_option = '<div class="answer" "option">';
    const sentence = questions[index].answer;
    let wordArr = sentence.split(/([,.\s])/);
    let option_tag;

    let finalWordArr = [];
    for (const word of wordArr) {
      if (word !== " " && word !== "") {
        finalWordArr.push(word);
      }
    }

    let i = 0;
    for (const word of finalWordArr) {
      answer_target += '<span class="target';
      answer_target += " target" + String(i) + '"';
      answer_target += ">&nbsp;</span>";
      questions[index].direct_answers[i++] = word;
    }

    ansList = [];
    while (ansList.length < finalWordArr.length) {
      var r = Math.floor(Math.random() * finalWordArr.length);
      if (ansList.indexOf(r) === -1) ansList.push(r);
    }
    console.log(ansList);
    for (i = 0; i < finalWordArr.length; i++) {
      answer_option += '<span class="my_option"';
      answer_option += ' class="select' + i + '" >';
      answer_option += finalWordArr[ansList[i]];
      answer_option += "</span>";
    }
    console.log(answer_option);

    answer_option += "</div>";
    option_list.innerHTML = answer_target;
    select_list.innerHTML = answer_option;
    correct_list.innerHTML = "";
    console.log(answer_option);

    for (i = 0; i < finalWordArr.length; i++) {
      answer_option += '<span class="my_option">';
      answer_option += finalWordArr[ansList[i]];
      answer_option += "</span>";
    }

    const answer_options = document.querySelectorAll(".my_option");
    let answer_result = true;
    for (let i = 0; i < answer_options.length; i++) {
      answer_options[i].addEventListener("click", function () {
        let tmpClassName = ".target" + String(nowCursorFocus);
        document.querySelector(tmpClassName).innerText = this.innerText;
        nowCursorFocus++;
        if (nowCursorFocus === answer_options.length) {
          for (let j = 0; j < answer_options.length; j++) {
            if (
              document.querySelector(".target" + String(j)).innerText !==
              questions[index].direct_answers[j]
            ) {
              answer_result = false;
            }
          }
          if (answer_result === true) directSelected("correct");
          else directSelected("incorrect");
        }
      });
    }
  }

  const option = option_list.querySelectorAll(".option");

  // set onclick attribute to all available options
  for (i = 0; i < option.length; i++) {
    option[i].setAttribute("onclick", "optionSelected(this)");
  }
}
// creating the new div tags which for icons
let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

function directSelected(userAns) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let correcAns = questions[que_count].answer; //getting correct answer from array

  if (userAns === "correct") {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    if (curQuesType === "direct_input") {
      document.querySelector(".direct_input").style.backgroundColor = "green";
    }
  } else {
    console.log("Wrong Answer");
    if (curQuesType !== "direct_input") {
      document.querySelector(".option").classList.add("incorrect");
    } //adding red color to correct selected option
    else {
      document.querySelector(".direct_input").style.backgroundColor = "red";
    }
    // if (curQuesType === "direct_input") {
    //   correct_list.innerHTML = questions[que_count].question.replace(
    //     ".mp3",
    //     ""
    //   );
    // }
    // document
    //   .querySelector(".incorrect")
    //   .insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
  }
  document.querySelector(".correct_list").inner_html =
    questions[que_count].answer;
  correct_list.innerHTML = questions[que_count].answer;

  next_btn.classList.add("show"); //show the next button if user selected any option
}

//if user clicked on option
function optionSelected(answer) {
  clearInterval(counter); //clear counter
  clearInterval(counterLine); //clear counterLine
  let userAns = answer.textContent; //getting user selected option
  let correcAns = questions[que_count].answer; //getting correct answer from array
  const allOptions = option_list.children.length; //getting all option items

  if (answer === "correct") userAns = correcAns;

  if (userAns == correcAns) {
    //if user selected option is equal to array's correct answer
    userScore += 1; //upgrading score value with 1
    answer.classList.add("correct"); //adding green color to correct selected option
    answer.insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to correct selected option
    console.log("Correct Answer");
    console.log("Your correct answers = " + userScore);
  } else {
    answer.classList.add("incorrect"); //adding red color to correct selected option
    answer.insertAdjacentHTML("beforeend", crossIconTag); //adding cross icon to correct selected option
    console.log("Wrong Answer");

    for (i = 0; i < allOptions; i++) {
      if (option_list.children[i].textContent == correcAns) {
        //if there is an option which is matched to an array answer
        option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
        option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
        console.log("Auto selected correct answer.");
      }
    }
  }
  for (i = 0; i < allOptions; i++) {
    option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
  }
  next_btn.classList.add("show"); //show the next button if user selected any option
}

function showResult() {
  quiz_box.classList.remove("activeQuiz"); //hide quiz box
  result_box.classList.add("activeResult"); //show result box
  const scoreText = result_box.querySelector(".score_text");
  const resultICON = result_box.querySelector(".icon");
  let final_score = Math.floor((userScore * 100) / questions.length);

  var myNewScore = final_score;
  var selCategory = document.getElementById("category").value;
  var selLevel = document.getElementById("level").value;
  var myStorageScore = localStorage.getItem(selCategory + "_" + selLevel);
  if (myStorageScore === null) myStorageScore = 0;

  if (myNewScore > myStorageScore)
    localStorage.setItem(selCategory + "_" + selLevel, myNewScore);

  if (final_score === 100) {
    // if user scored more than 3
    resultICON.innerHTML = '<i class="fas fa-crown"></i>';
    //creating a new span tag and passing the user score number and total question number
    let scoreTag =
      "<span>恭喜! 🎉, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag; //adding new span tag inside score_Text
  } else if (final_score >= 80) {
    // if user scored more than 1
    resultICON.innerHTML = '<i class="fas fa-grin-beam-sweat"></i>';
    let scoreTag =
      "<span>不錯 😎, 你得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // if user scored less than 1
    resultICON.innerHTML = '<i class="fas fa-tired"></i>';
    let scoreTag =
      "<span>很可惜 😐, 你只得到 <p>" + final_score + "</p> 分 </span>";
    scoreText.innerHTML = scoreTag;
  }
}

function startTimer() {
  counter = setInterval(timer, 1000);
  function timer() {
    curTimeValue = curTimeValue - 1;

    if (curTimeValue >= 0) {
      timeCount.textContent = curTimeValue; //changing the value of timeCount with time value
    }
    if (curTimeValue < 10 && curTimeValue >= 0) {
      //if timer is less than 9
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero; //add a 0 before time value
    }
    if (curTimeValue < 0) {
      //if timer is less than 0
      clearInterval(counter); //clear counter
      timeText.textContent = "時間到"; //change the time text to time off
      const allOptions = option_list.children.length; //getting all option items
      let correcAns = questions[que_count].answer; //getting correct answer from array
      for (i = 0; i < allOptions; i++) {
        if (option_list.children[i].textContent == correcAns) {
          //if there is an option which is matched to an array answer
          option_list.children[i].setAttribute("class", "option correct"); //adding green color to matched option
          option_list.children[i].insertAdjacentHTML("beforeend", tickIconTag); //adding tick icon to matched option
          console.log("Time Off: Auto selected correct answer.");
        }
      }
      for (i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled"); //once user select an option then disabled all options
      }
      next_btn.classList.add("show"); //show the next button if user selected any option
    }
  }
}

function startTimerLine() {
  counterLine = setInterval(timer, 1000);
  var timeLine;
  function timer() {
    if (curTimeValue <= 0) {
      //if time value is greater than 549
      clearInterval(counterLine); //clear counterLine
    }
    timeLine = (timeValue - curTimeValue) * (quizHeaderWidth / timeValue); //upgrading time value with 1
    time_line.style.width = timeLine + "px"; //increasing width of time_line with px by time value
  }
}

function queCounter(index) {
  //creating a new span tag and passing the question number and total question
  let totalQueCounTag =
    "<span> 問題 (	&nbsp; <p>" +
    index +
    "</p> / <p>" +
    questions.length +
    " )</p></span>";
  bottom_ques_counter.innerHTML = totalQueCounTag; //adding new span tag inside bottom_ques_counter
}

/* ------------------------------------------------
    * 字典檢索 鍵盤輸入
-------------------------------------------------*/

function inputkeyb(char) {
  var field = document.getElementById("direct_input");
  if (field.name.length) {
    // back
    if (char == "back") {
      var oldVal = field.value;
      field.value = oldVal.substr(0, oldVal.length - 1);
      return false;
    }

    // space
    if (char == "space") char = " ";

    // Add the character
    field.value = field.value + char;
  }
}

document.addEventListener("keydown", keydown);
function keydown(e) {
  // alert("ben_debug:" + e.code);
  e.preventDefault();
  switch (e.code) {
    case "Space":
      inputkeyb("space");
      break;
    case "Digit1":
      inputkeyb("ㄅ");
      break;
    case "Digit2":
      inputkeyb("ㄉ");
      break;
    case "Digit3":
      inputkeyb("ˇ");
      break;
    case "Digit4":
      inputkeyb("ˋ");
      break;
    case "Digit5":
      inputkeyb("ㄓ");
      break;
    case "Digit6":
      inputkeyb("ˊ");
      break;
    case "Digit7":
      inputkeyb("˙");
      break;
    case "Digit8":
      inputkeyb("ㄚ");
      break;
    case "Digit9":
      inputkeyb("ㄞ");
      break;
    case "Digit0":
      inputkeyb("ㄢ");
      break;
    case "Minus":
      inputkeyb("ㄦ");
      break;
    case "KeyQ":
      inputkeyb("ㄆ");
      break;
    case "KeyW":
      inputkeyb("ㄊ");
      break;
    case "KeyE":
      inputkeyb("ㄍ");
      break;
    case "KeyR":
      inputkeyb("ㄐ");
      break;
    case "KeyT":
      inputkeyb("ㄔ");
      break;
    case "KeyY":
      inputkeyb("ㄗ");
      break;
    case "KeyU":
      inputkeyb("ㄧ");
      break;
    case "KeyI":
      inputkeyb("ㄛ");
      break;
    case "KeyO":
      inputkeyb("ㄟ");
      break;
    case "KeyP":
      inputkeyb("ㄣ");
      break;
    case "KeyA":
      inputkeyb("ㄇ");
      break;
    case "KeyS":
      inputkeyb("ㄋ");
      break;
    case "KeyD":
      inputkeyb("ㄎ");
      break;
    case "KeyF":
      inputkeyb("ㄑ");
      break;
    case "KeyG":
      inputkeyb("ㄕ");
      break;
    case "KeyH":
      inputkeyb("ㄘ");
      break;
    case "KeyJ":
      inputkeyb("ㄨ");
      break;
    case "KeyK":
      inputkeyb("ㄜ");
      break;
    case "KeyL":
      inputkeyb("ㄠ");
      break;
    case "KeyL":
      inputkeyb("ㄠ");
      break;
    case "Semicolon":
      inputkeyb("ㄤ");
      break;
    case "KeyZ":
      inputkeyb("ㄈ");
      break;
    case "KeyX":
      inputkeyb("ㄌ");
      break;
    case "KeyC":
      inputkeyb("ㄏ");
      break;
    case "KeyV":
      inputkeyb("ㄒ");
      break;
    case "KeyB":
      inputkeyb("ㄖ");
      break;
    case "KeyN":
      inputkeyb("ㄙ");
      break;
    case "KeyM":
      inputkeyb("ㄩ");
      break;
    case "Comma":
      inputkeyb("ㄝ");
      break;
    case "Period":
      inputkeyb("ㄡ");
      break;
    case "Slash":
      inputkeyb("ㄥ");
      break;
    case "Backspace":
      inputkeyb("back");
      break;

    default:
      break;
  }
}

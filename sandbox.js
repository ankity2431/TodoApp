let addTaskBtn = document.getElementsByClassName("colorBtn")[0];
let popupContainer = document.getElementsByClassName("popupContainer")[0];
let createTask = document.getElementsByClassName("createBtn")[0];
let searchWrapper = document.getElementsByClassName("searchwrapper")[0];
let inputField = document.getElementById("inputField");

function toggleCompletedTask(toggle, LIelement) {
  const completedTask = JSON.parse(localStorage.getItem("taskList")).map(
    (value) => {
      if (value.taskName === LIelement.textContent) {
        return {
          ...value,
          completed: toggle,
        };
      }
      return value;
    }
  );

  localStorage.setItem("taskList", JSON.stringify(completedTask));
}



const timeDistance = (date1, date2) => {
  console.log("im running",date1, date2);
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  // return `${hours}:${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
  return [hours, minutes, seconds]

};

// let startTimer = ["1pm", "3pm", "6pm"]
// let stopTimer = ["2:30pm", "5:55pm"] 

function addTimes(time1, time2) {
 
  const [h1, m1, s1] = time1
  const [h2, m2, s2] = time2
  // Calculate the total seconds, minutes, and hours
  let totalSeconds = s1 + s2;
  let extraMinutes = Math.floor(totalSeconds / 60);
  let seconds = totalSeconds % 60;

  let totalMinutes = m1 + m2 + extraMinutes;
  let extraHours = Math.floor(totalMinutes / 60);
  let minutes = totalMinutes % 60;

  let hours = h1 + h2 + extraHours;

  // Return the result as an array [h, m, s]
  return [hours, minutes, seconds];
}



function timeDifference(startTimeArr, stopTimeArr) {
  let hour = 0;
  let min = 0;
  let sec = 0;

  for (let i = 0; i < startTimeArr.length; i++) {
    let stopTime = stopTimeArr[i] ? new Date(stopTimeArr[i]) : new Date();
    let ans = timeDistance(new Date(startTimeArr[i]), stopTime);
    
    [hour, min, sec] = addTimes([hour, min, sec], ans);
  }

  return [hour, min, sec];
}


function makeTask(
  taskName,
  CointainerUL,
  taskId,
  color,
  timerStartTime,
  isTimerStarted,
  stopTimer
) {
  let cointainerLI = document.createElement("div");
  let LIelement = document.createElement("li");
  let wrapperDiv = document.createElement("div");
  let editDiv = document.createElement("div");
  let deleteDiv = document.createElement("div");
  let editImg = document.createElement("img");
  let deleteImg = document.createElement("img");
  let startTimerDiv = document.createElement("div");
  let startTimerBtn = document.createElement("button");
  let editInput = document.createElement("input");
  // let textWrap = document.createElement("div");
  let timerDiv = document.createElement("div");
  let checkboxDiv = document.createElement("div");
  let liWrapper = document.createElement("div");

  editDiv.className = "displayBlock";
  deleteDiv.className = "displayBlock";
  timerDiv.setAttribute("class", "paddingLeft");
  checkboxDiv.setAttribute("class", "checkBox");
  checkboxDiv.style.backgroundColor = color ? "green" : "red";
  LIelement.style.textDecoration = color ? "line-through" : "none";
  wrapperDiv.className = color ? "displayNone" : "flex";
  liWrapper.setAttribute("class", "flex");

  

 const timerArray = timeDifference(timerStartTime, stopTimer);

  const minute = document.createElement("span");
  minute.textContent =  timerArray[1];

  const second = document.createElement("span");
  second.textContent = timerArray[2];
  const colon = document.createElement("span");
  colon.textContent = "m:";
  const secondText = document.createElement("span");
  secondText.textContent = "s";
  const hour = document.createElement("span");
  hour.textContent = timerArray[0];
  const hourColon = document.createElement("span");
  hourColon.textContent = "h:";


  let secondCount;

  

  startTimerBtn.addEventListener("click", () => {

    let currentask = JSON.parse(localStorage.getItem('taskList')).filter((value)=> value.taskName === LIelement.textContent)
    if (!currentask[0].timerStarted) {// ui driven --->  data driven // false

      let newTaskListWithUpdatedTimer = JSON.parse(
        localStorage.getItem("taskList")
      ).map((value) => {
        if (value.taskName == LIelement.textContent) {
          value.timerStartTime.push(new Date());
          return {
            ...value,
            timerStarted: true,
           

          };
        } else {
          return value;
        }
      });

      localStorage.setItem(
        "taskList",
        JSON.stringify(newTaskListWithUpdatedTimer)
      );

      editDiv.className = "displayNone";
      deleteDiv.className = "displayNone";

      startTimerBtn.textContent = "stop timer";

      startTimerDiv.appendChild(startTimerBtn);
    wrapperDiv.appendChild(startTimerDiv);
    timerDiv.appendChild(hour);
    timerDiv.appendChild(hourColon);
    timerDiv.appendChild(minute);
    timerDiv.appendChild(colon);
    timerDiv.appendChild(second);
    timerDiv.appendChild(secondText);
    wrapperDiv.appendChild(timerDiv)


      secondCount = setInterval(() => {
        console.log("interval running because of start button")
        if (second.textContent == "59") {
          minute.textContent = Number(minute.textContent) + 1;
          second.textContent = 0;
        }
        if (minute.textContent == "59") {
          hour.textContent = Number(hour.textContent) + 1;
        }
        second.textContent = Number(second.textContent) + 1;
      }, 1000);
    } else {
    
      let newTaskListWithUpdatedTimer = JSON.parse(
        localStorage.getItem("taskList")
      ).map((value) => {
        if (value.taskName == LIelement.textContent) {
          value.stopTimer.push(new Date());
          return {
            ...value,
            timerStarted: false,
            
          };
        }return value;
      });
      localStorage.setItem(
        "taskList",
        JSON.stringify(newTaskListWithUpdatedTimer)
      );

      editDiv.className = "displayBlock";
      deleteDiv.className = "displayBlock";

      startTimerBtn.textContent = "start timer";

      timerDiv.removeChild(minute);
      timerDiv.removeChild(colon);
      timerDiv.removeChild(second);
      wrapperDiv.removeChild(timerDiv);
      clearInterval(secondCount);

      editDiv.appendChild(editImg);
      deleteDiv.appendChild(deleteImg);
      wrapperDiv.appendChild(editDiv);
      wrapperDiv.appendChild(deleteDiv);
      startTimerDiv.appendChild(startTimerBtn);
      
      // wrapperDiv.removeChild(timerDiv)
      wrapperDiv.appendChild(startTimerDiv);
      cointainerLI.appendChild(wrapperDiv)
    }
  });

  
  deleteImg.addEventListener("click", (event) => {
    let taskId = event.target.getAttribute("data-Id");
    let taskList = JSON.parse(localStorage.getItem("taskList")) || [];
    taskList.splice(taskId, 1);
    localStorage.setItem("taskList", JSON.stringify(taskList));
    populateTasksInDom();
    cointainerLI.remove();
    // localStorage.removeItem('taskList')
  });

  let editTask = "";
  editImg.addEventListener("click", () => {
    if (editImg.getAttribute("src") == "./assests/pencil-fill.png") {
      editTask = LIelement.textContent;
      editImg.setAttribute("src", "./assests/save-fill.png");
      editInput.className = "displayBlock";
      editInput.value = LIelement.textContent;
      // textWrap.className = "displayNone";
      LIelement.classList.add("displayNone");
    } else {
      editImg.setAttribute("src", "./assests/pencil-fill.png");
      editInput.className = "displayNone";
      LIelement.textContent = editInput.value;
      // textWrap.className = "displayBlock";
      LIelement.classList.remove("displayNone");

      //complete array leke ana hai --> map --> push new array in localStorage
      // string --> jsobject form --> JSON.parse
      // jsObject --> string --> JSON.stringfy

      const updatedTasks = JSON.parse(localStorage.getItem("taskList")).map(
        (value) => {
          if (value.taskName === editTask) {
            return {
              ...value,
              taskName: editInput.value,
            };
          }
          return value;
        }
      );

      localStorage.setItem("taskList", JSON.stringify(updatedTasks));
    }
  });

  editInput.setAttribute("type", "text");
  editInput.className = "displayNone";

  // textWrap.className = "textwrap";
  // editInput.textContent = LIelement.textContent
  // startTimerBtn.textContent = "start timer";
  deleteImg.setAttribute("data-Id", taskId);
  editImg.setAttribute("src", "./assests/pencil-fill.png");
  deleteImg.setAttribute("src", "./assests/delete-bin-6-fill.png");
  cointainerLI.setAttribute("class", "fullflex");

  startTimerDiv.setAttribute("class", "displayNone");
  startTimerBtn.classList.add("timerbtn");

 

  LIelement.textContent = taskName;

  CointainerUL.appendChild(cointainerLI);
  liWrapper.appendChild(checkboxDiv);
  liWrapper.appendChild(LIelement);
  cointainerLI.appendChild(liWrapper);

  // cointainerLI.appendChild(textWrap);
  liWrapper.appendChild(editInput);

  cointainerLI.appendChild(wrapperDiv);

  cointainerLI.addEventListener("mouseover", () => {
    startTimerDiv.setAttribute("class", "displayBlock");
  });

  cointainerLI.addEventListener("mouseout", () => {
    startTimerDiv.setAttribute("class", "displayNone");
  });

  // if else for timer button
  if(isTimerStarted){
    editDiv.className = 'displayNone'
    deleteDiv.className = 'displayNone'
    startTimerBtn.textContent = 'stop timer'

    secondCount = setInterval(() => {
      console.log("interval running because of page refresh")
      if (second.textContent == "59") {
        minute.textContent = Number(minute.textContent) + 1;
        second.textContent = 0;
      }
      if (minute.textContent == "59") {
        hour.textContent = Number(hour.textContent) + 1;
      }
      second.textContent = Number(second.textContent) + 1;
    }, 1000);

    startTimerDiv.appendChild(startTimerBtn);
    wrapperDiv.appendChild(startTimerDiv);
    timerDiv.appendChild(hour);
    timerDiv.appendChild(hourColon);
    timerDiv.appendChild(minute);
    timerDiv.appendChild(colon);
    timerDiv.appendChild(second);
    timerDiv.appendChild(secondText);
    wrapperDiv.appendChild(timerDiv)

  }else{
    editDiv.className = "displayBlock";
    deleteDiv.className = "displayBlock";

    startTimerBtn.textContent = "start timer"


    editDiv.appendChild(editImg);
    deleteDiv.appendChild(deleteImg);
    wrapperDiv.appendChild(editDiv);
    wrapperDiv.appendChild(deleteDiv);
    startTimerDiv.appendChild(startTimerBtn);
    
  
    wrapperDiv.appendChild(startTimerDiv);
    cointainerLI.appendChild(wrapperDiv)
  }


  checkboxDiv.addEventListener("click", () => {
    if (checkboxDiv.style.backgroundColor == "green") {
      toggleCompletedTask(false, LIelement);
      populateTasksInDom();

    } else {
      toggleCompletedTask(true, LIelement);
      populateTasksInDom();
    }
  });
}

function dateInformat(dateObject) {
  // return `${dateObject.getFullYear()}-${(dateObject.getMonth()+1 <10  ) ? `0${dateObject.getMonth() + 1}` : `${dateObject.getMonth()+1}`}-${dateObject.getDate()}`
  return `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${dateObject.getDate().toString().padStart(2, "0")}`;
}

populateTasksInDom();

function populateTasksInDom(searchResponseTaskList) {
  if (!localStorage.getItem("taskList")) return;

  let currentDate = new Date();
  let tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  let currentDateInProperformat = dateInformat(currentDate);

  let filterArray = searchResponseTaskList
    ? searchResponseTaskList
    : JSON.parse(localStorage.getItem("taskList"));

  let todayTaskList = filterArray.filter((element) => {
    return (
      element.dueDate.slice(0, 10) <= currentDateInProperformat &&
      !element.completed
    );
    //     5/11/2024       7/11/2024
  });


  let tomorrowTaskList = filterArray.filter((elem) => {
    return (
      elem.dueDate.slice(0, 10) === dateInformat(tomorrowDate) &&
      !elem.completed
    );
  });


  let otherTaskList = filterArray.filter((elem) => {
    return (
      elem.dueDate.slice(0, 10) !== currentDateInProperformat &&
      elem.dueDate.slice(0, 10) !== dateInformat(tomorrowDate) &&
      !elem.completed
    );
  });


  let completedTaskList = JSON.parse(localStorage.getItem("taskList")).filter(
    (elem) => elem.completed
  );

  let todayLI = document.getElementById("todaysTodoList");
  todayLI.innerHTML = "";
  let tomorrowLI = document.getElementById("tomorrowTodoList");
  tomorrowLI.innerHTML = "";
  let otherLI = document.getElementById("nextTodoList");
  otherLI.innerHTML = "";
  let completedLI = document.getElementById("completedTodoList");
  completedLI.innerHTML = "";

  for (let i = 0; i < todayTaskList.length; i++) {
    makeTask(
      todayTaskList[i].taskName,
      todayLI,
      i,
      false,
      todayTaskList[i].timerStartTime,
      todayTaskList[i].timerStarted, 
      todayTaskList[i].stopTimer
    );
  }

  for (let i = 0; i < tomorrowTaskList.length; i++) {
    makeTask(
      tomorrowTaskList[i].taskName,
      tomorrowLI,
      i,
      false,
      tomorrowTaskList[i].timerStartTime,
      tomorrowTaskList[i].timerStarted,
      tomorrowTaskList[i].stopTimer
    );
  }

  for (let i = 0; i < otherTaskList.length; i++) {
    makeTask(
      otherTaskList[i].taskName,
      otherLI,
      i,
      false,
      otherTaskList[i].timerStartTime,
      otherTaskList[i].timerStarted,
      otherTaskList[i].stopTimer
    );
  }

  for (let i = 0; i < completedTaskList.length; i++) {
    makeTask(completedTaskList[i].taskName, completedLI, i, true);
  }
}

addTaskBtn.addEventListener("click", () => {
  popupContainer.style.display = "flex";
});

popupContainer.addEventListener("click", (e) => {
  if (e.target === popupContainer) {
    popupContainer.style.display = "none";
  }
});

createTask.addEventListener("click", () => {
  let taskName = document.getElementById("TName");
  let dueDate = document.getElementById("dueDate");

  let taskList = localStorage.getItem("taskList");
  taskList !== null
    ? localStorage.setItem(
        "taskList",
        JSON.stringify([
          ...JSON.parse(localStorage.getItem("taskList")),
          {
            taskName: taskName.value,
            dueDate: dueDate.value,
            completed: false,
            timerStarted: false,
            timerStartTime: [],
            stopTimer: [],
          },
        ])
      )
    : localStorage.setItem(
        "taskList",
        JSON.stringify([
          {
            taskName: taskName.value,
            dueDate: dueDate.value,
            completed: false,
            timerStarted: false,
            timerStartTime: [],
            stopTimer: [],
          },
        ])
      );
  populateTasksInDom();

  popupContainer.style.display = "none";
});

searchWrapper.addEventListener("click", () => {
  let searchText = inputField.value;
  if (searchText == "") {
    populateTasksInDom();
    return;
  }
  let searchResponseTaskList = JSON.parse(
    localStorage.getItem("taskList")
  ).filter((element) =>
    element.taskName.toLowerCase().includes(searchText.toLowerCase())
  );
  populateTasksInDom(searchResponseTaskList);
});

inputField.addEventListener("change", (e) => {
  if (inputField.value == "") {
    populateTasksInDom();
  }
});









//1 if1 both array me equal vaak11
// t1imer 1is st1i1ll running
// sum of length of start + stop == odd -> sum of all previous difference + last index - current time --> sum of all previous difference
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
  let distance = Math.abs(date1 - date2);
  const hours = Math.floor(distance / 3600000);
  distance -= hours * 3600000;
  const minutes = Math.floor(distance / 60000);
  distance -= minutes * 60000;
  const seconds = Math.floor(distance / 1000);
  return `${hours}:${('0' + minutes).slice(-2)}:${('0' + seconds).slice(-2)}`;
};


function makeTask(taskName, CointainerUL, taskId, color , timerStartTime ,isTimerStarted) {
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

  let timerArray = (isTimerStarted) ? timeDistance(new Date(timerStartTime), new Date()).split(":") : undefined;
  console.log("timer array is ",timerArray);

  const minute = document.createElement("span");
  minute.textContent = (isTimerStarted)? timerArray[1] : 0;
  const second = document.createElement("span");
  second.textContent = (isTimerStarted)? timerArray[2] : 0;
  const colon = document.createElement("span");
  colon.textContent = "m:";
  const secondText = document.createElement("span");
  secondText.textContent = "s";
  const hour = document.createElement("span");
  hour.textContent = (isTimerStarted)? timerArray[0] : 0;
  const hourColon = document.createElement("span");
  hourColon.textContent = "h:";

  let secondCount;

  startTimerBtn.addEventListener("click", () => {
    if (editDiv.className === "displayBlock") {
      let newTaskListWithUpdatedTimer = JSON.parse(
        localStorage.getItem("taskList")
      ).map((value) => {
        if (value.taskName == LIelement.textContent) {
          return {
            ...value,
            timerStarted: true,
            timerStartTime: new Date(),
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

      timerDiv.appendChild(hour);
      timerDiv.appendChild(hourColon);

      timerDiv.appendChild(minute);
      timerDiv.appendChild(colon);
      timerDiv.appendChild(second);
      timerDiv.appendChild(secondText);
      wrapperDiv.appendChild(timerDiv);
      secondCount = setInterval(() => {
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
      editDiv.className = "displayBlock";
      deleteDiv.className = "displayBlock";

      startTimerBtn.textContent = "start timer";

      timerDiv.removeChild(minute);
      timerDiv.removeChild(colon);
      timerDiv.removeChild(second);
      wrapperDiv.removeChild(timerDiv);
      clearInterval(secondCount);
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
  startTimerBtn.textContent = "start timer";
  deleteImg.setAttribute("data-Id", taskId);
  editImg.setAttribute("src", "./assests/pencil-fill.png");
  deleteImg.setAttribute("src", "./assests/delete-bin-6-fill.png");
  cointainerLI.setAttribute("class", "fullflex");

  startTimerDiv.setAttribute("class", "displayNone");
  startTimerBtn.classList.add("timerbtn");

  editDiv.appendChild(editImg);
  deleteDiv.appendChild(deleteImg);
  wrapperDiv.appendChild(editDiv);
  wrapperDiv.appendChild(deleteDiv);
  startTimerDiv.appendChild(startTimerBtn);
  wrapperDiv.appendChild(startTimerDiv);

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

  checkboxDiv.addEventListener("click", () => {
    if (checkboxDiv.style.backgroundColor == "green") {
      // console.log("INside the checkbox div", checkboxDiv.style.backgroundColor)
      //   checkboxDiv.style.backgroundColor = "red";
      //   LIelement.style.textDecoration = 'line-through'
      //   wrapperDiv.className = 'displayNone'

      toggleCompletedTask(false, LIelement);
      populateTasksInDom();
    } else {
      // checkboxDiv.style.backgroundColor = "green";
      //  LIelement.style.textDecoration = 'none';
      //  wrapperDiv.classList.remove('displayNone')
      //  wrapperDiv.classList.add('flex')
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
    console.log("inside today task list filter");
    return (
      element.dueDate.slice(0, 10) <= currentDateInProperformat &&
      !element.completed
    );
    //     5/11/2024       7/11/2024
  });

  console.log("todayTaskList", todayTaskList);

  let tomorrowTaskList = filterArray.filter((elem) => {
    return (
      elem.dueDate.slice(0, 10) === dateInformat(tomorrowDate) &&
      !elem.completed
    );
  });

  console.log("tomorrowTaskList", tomorrowTaskList);

  let otherTaskList = filterArray.filter((elem) => {
    return (
      elem.dueDate.slice(0, 10) !== currentDateInProperformat &&
      elem.dueDate.slice(0, 10) !== dateInformat(tomorrowDate) &&
      !elem.completed
    );
  });

  console.log("otherTaskList", otherTaskList);

  let completedTaskList = JSON.parse(localStorage.getItem("taskList")).filter(
    (elem) => elem.completed
  );
  console.log("completed tasklist is", completedTaskList);

  let todayLI = document.getElementById("todaysTodoList");
  todayLI.innerHTML = "";
  let tomorrowLI = document.getElementById("tomorrowTodoList");
  tomorrowLI.innerHTML = "";
  let otherLI = document.getElementById("nextTodoList");
  otherLI.innerHTML = "";
  let completedLI = document.getElementById("completedTodoList");
  completedLI.innerHTML = "";

  for (let i = 0; i < todayTaskList.length; i++) {
    makeTask(todayTaskList[i].taskName, todayLI, i, false, todayTaskList[i].timerStartTime, todayTaskList[i].timerStarted);
  }

  for (let i = 0; i < tomorrowTaskList.length; i++) {
    makeTask(tomorrowTaskList[i].taskName, tomorrowLI, i, false, tomorrowTaskList[i].timerStartTime, tomorrowTaskList[i].timerStarted);
  }

  for (let i = 0; i < otherTaskList.length; i++) {
    makeTask(otherTaskList[i].taskName, otherLI, i, false, otherTaskList[i].timerStartTime, otherTaskList[i].timerStarted);
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
            timerStartTime: "",
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
            timerStartTime: "",
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
  console.log(searchResponseTaskList);
  populateTasksInDom(searchResponseTaskList);
});

inputField.addEventListener("change", (e) => {
  console.log(e);
  if (inputField.value == "") {
    populateTasksInDom();
  }
});



console.log(timeDistance(new Date("2024-11-07T10:44:08.410Z"), new Date()))

// function formatDate(difference) {
//   //Arrange the difference of date in days, hours, minutes, and seconds format
//   let days = Math.floor(difference / (1000 * 60 * 60 * 24));
//   let hours = Math.floor(
//     (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
//   );
//   let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
//   let seconds = Math.floor((difference % (1000 * 60)) / 1000);
//   return (
//     "Total time elapsed is: " +
//     days +
//     " days " +
//     hours +
//     " hours " +
//     minutes +
//     " minutes " +
//     seconds +
//     " seconds."
//   );
// }
// let start = new Date("2024-11-07T10:44:08.410Z");
// let end = new Date();
// let difference = end - start;
// console.log(new Date("2024-11-07T10:44:08.410Z"));

document.addEventListener("DOMContentLoaded", function () {
  //chrome.storage.sync.clear();
  var taskForm = document.getElementById("task-form");
  var taskInput = document.getElementById("task-input");
  var taskList = document.getElementById("task-list");
  // Load tasks from local storage and display them
  loadTasksFromStorage();

  // Add a task
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var task = taskInput.value;
    if (taskInput.value.trim() === "") {
      // If it's empty, show an error message and return
      return;
    }

    addTaskToList(task, false);
    // Save the task with a 'completed' property
    saveTaskToStorage({ text: task, completed: false });
    taskInput.value = "";
  });

  // Load tasks from storage
  function loadTasksFromStorage() {
    chrome.storage.local.get("tasks", function (data) {
      var tasks = data.tasks || [];
      tasks.forEach(function (task) {
        addTaskToList(task.text, task.completed);
      });
    });
  }

  function addTaskToList(task, completed) {
    var li = document.createElement("li");

    var taskText = document.createElement("span");
    taskText.className = "item";
    taskText.textContent = task;
    // Strike through the task if it's completed
    if (completed) {
      taskText.style.textDecoration = "line-through";
    }
    li.appendChild(taskText);

    var completeButton = document.createElement("button");
    //completeButton.textContent = "Mark as Complete";
    completeButton.className = "complete";
    li.appendChild(completeButton);

    var deleteButton = document.createElement("button");
    //deleteButton.textContent = "Delete";
    deleteButton.className = "delete";
    li.appendChild(deleteButton);

    taskList.appendChild(li);
  }

  function saveTaskToStorage(task) {
    chrome.storage.local.get("tasks", function (data) {
      var tasks = data.tasks || [];
      tasks.push(task);
      chrome.storage.local.set({ tasks: tasks });
    });
  }

  // Delete a task
  taskList.addEventListener("click", function (e) {
    if (e.target.className === "delete") {
      var task = e.target.parentElement.querySelector("span.item").textContent;
      var completed =
        e.target.parentElement.querySelector("span.item").style
          .textDecoration === "line-through";
      e.target.parentElement.remove();
      deleteTaskFromStorage({ text: task, completed: completed });
    }
  });

  function deleteTaskFromStorage(task) {
    console.log("Delete" + task);
    chrome.storage.local.get("tasks", function (data) {
      var tasks = data.tasks || [];
      var taskIndex = tasks.findIndex(function (t) {
        return t.text === task.text; //&& t.completed === task.completed;
      });
      console.log("TaskIndex: " + taskIndex);
      if (taskIndex > -1) {
        tasks.splice(taskIndex, 1);
      }
      chrome.storage.local.set({ tasks: tasks });
    });
  }

  // Add event listener to complete task button
  // document
  //   .querySelector(".complete")
  //   .addEventListener("click", function (event) {
  //     // Toggle 'completed' class on task item
  //     event.target.parentNode.classList.toggle("completed");
  //   });

  // Mark a task as complete
  taskList.addEventListener("click", function (e) {
    if (
      e.target.className === "complete" ||
      e.target.className === "completed"
    ) {
      var taskToMark = e.target.parentElement.firstChild;
      taskToMark.style.textDecoration =
        taskToMark.style.textDecoration === "line-through"
          ? "none"
          : "line-through";
      let className =
        e.target.className === "complete" ? "completed" : "complete";
      e.target.className = className;
      //taskToMark.className = className;
      // Update the task's 'completed' property
      updateTaskCompletionStatus(
        taskToMark.textContent,
        taskToMark.style.textDecoration === "line-through"
      );
    }
  });

  // Update a task's completion status in storage
  function updateTaskCompletionStatus(task, completed) {
    chrome.storage.local.get("tasks", function (data) {
      var tasks = data.tasks || [];
      var taskToUpdate = tasks.find(function (t) {
        return t.text === task;
      });
      if (taskToUpdate) {
        taskToUpdate.completed = completed;
      }
      chrome.storage.local.set({ tasks: tasks });
    });
  }
});

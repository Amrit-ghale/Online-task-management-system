var users = {
    'admin': { password: 'admin', email: 'admin@example.com' }
  };
  
  var tasks = [];
  var loggedInUser = '';
  
  // check if users data exists in localStorage, if not, initialize it.
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(users));
  } else {
    users = JSON.parse(localStorage.getItem('users'));
  }
  
  //check if the task data exists in localStorage, if yes, laod it
  if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
   // Check if a user is logged in or not.
  if (localStorage.getItem('loggedInUser')) {
    loggedInUser = localStorage.getItem('loggedInUser');

    //Check if the logged-in user is admin
    if (loggedInUser === 'admin') {
      document.getElementById('adminDashboard').style.display = 'block';
      loadAdminDashboard();
    } else {
      document.getElementById('userDashboard').style.display = 'block';
      loadUserDashboard();
    }
  }
  
  function showSignupForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('signupForm').style.display = 'block';  
}
  
  function login(event) {
    event.preventDefault();
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
  
    // Validating the username and the password
    if (users[username] && users[username].password === password) {
      loggedInUser = username;
      localStorage.setItem('loggedInUser', loggedInUser);
      window.location.href = 'dashboard.html';
      document.getElementById('loginForm').style.display = 'none';
  
      if (username === 'admin') {
        document.getElementById('adminDashboard').style.display = 'block';
        loadAdminDashboard();
      } else {
        document.getElementById('userDashboard').style.display = 'block';
        loadUserDashboard();
      }
    } else {
      alert('Invalid username or password');
    }
  }
  
  function signup(event) {
    event.preventDefault();
    var username = document.getElementById('newUsername').value;
    var password = document.getElementById('newPassword').value;
    var email = document.getElementById('newEmail').value;
  
    // validating the input fields.
    if (!username || !password || !email) {
      alert('Please enter a username, password, and email');
    } else if (users[username]) {
      alert('Username is already taken');
    } else {
      //create a new user
      users[username] = { password: password, email: email };
      localStorage.setItem('users', JSON.stringify(users));
      loggedInUser = username;
      localStorage.setItem('loggedInUser', loggedInUser);
      window.location.href = 'dashboard.html';
      document.getElementById('signupForm').style.display = 'none';
      document.getElementById('userDashboard').style.display = 'block';
      loadUserDashboard();
      
    }
  }
  
  function createTask() {
    var taskName = document.getElementById('taskName').value;
    var taskDesc = document.getElementById('taskDesc').value;
    var taskStartDate = document.getElementById('taskStartDate').value;
    var taskEndDate = document.getElementById('taskEndDate').value;
    var assignedMember = document.getElementById('assignedMember').value;
    var hourlyRate = document.getElementById('hourlyRate').value;
  
    //Validate the input fields.
    if (!taskName || !taskDesc || !taskStartDate || !taskEndDate || !assignedMember || !hourlyRate) {
      alert('Please fill in all fields');
    } else {
      //create a new task
      var taskId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;
      var task = {
        id: taskId,
        name: taskName,
        description: taskDesc,
        start: taskStartDate,
        end: taskEndDate,
        assignedTo: assignedMember,
        rate: hourlyRate,
        completed: false,
        hoursWorked: 0,
        completionDate: '', //Added comment: Initialie the hours worked to 0 for a new task.
        cost: 0
      };
      tasks.push(task);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadAdminDashboard();
      clearTaskForm();
    }
  }
  
  function loadAdminDashboard() {
    var taskList = document.getElementById('taskList');
    taskList.innerHTML = '';
    tasks.forEach(task => {
      var taskStatus = task.completed ? 'Completed' : 'In Progress';
      var taskStatusClass = task.completed ? 'text-success' : 'text-info';
  
      var taskCard = document.createElement('div');
      taskCard.className = 'card mb-3';
  
      var cardBody = document.createElement('div');
      cardBody.className = 'card-body';
  
      var taskTitle = document.createElement('h5');
      taskTitle.className = 'card-title';
      taskTitle.innerText = `${task.name} (${taskStatus})`;
  
      var taskDescription = document.createElement('p');
      taskDescription.className = 'card-text';
      taskDescription.innerText = task.description;
  
      var taskStart = document.createElement('p');
      taskStart.innerText = `Start: ${task.start}`;
  
      var taskEnd = document.createElement('p');
      taskEnd.innerText = `End: ${task.end}`;
  
      var assignedTo = document.createElement('p');
      assignedTo.innerText = `Assigned to: ${task.assignedTo}`;
  
      var taskRate = document.createElement('p');
      taskRate.innerText = `Rate: ${task.rate}`;
  
      var taskHoursWorked = document.createElement('p');
      taskHoursWorked.innerText = `Hours Worked: ${task.hoursWorked}`;
  
      var taskCost = document.createElement('p');
      taskCost.innerText = `Cost: $${task.cost}`;
  
      cardBody.appendChild(taskTitle);
      cardBody.appendChild(taskDescription);
      cardBody.appendChild(taskStart);
      cardBody.appendChild(taskEnd);
      cardBody.appendChild(assignedTo);
      cardBody.appendChild(taskRate);
      cardBody.appendChild(taskHoursWorked);
      cardBody.appendChild(taskCost);
  
      if (!task.completed) {
        var editButton = document.createElement('button');
        editButton.className = 'btn btn-primary';
        editButton.innerText = 'Edit';
        editButton.onclick = function () {
          editTask(task.id);
        };
  
        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function () {
          deleteTask(task.id);
        };
  
        cardBody.appendChild(editButton);
        cardBody.appendChild(deleteButton);
      }else {

        var deleteButton = document.createElement('button');
        deleteButton.className = 'btn btn-danger';
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = function () {
          deleteTask(task.id);
        };


        cardBody.appendChild(deleteButton);
      }
  
      taskCard.appendChild(cardBody);
      taskList.appendChild(taskCard);
    });
  }
  function loadUserDashboard() {
    var userTaskList = document.getElementById('userTaskList');
    userTaskList.innerHTML = '';
  
    if (tasks.length === 0) {
      // No tasks assigned
      var noTasksMessage = document.createElement('p');
      noTasksMessage.innerText = 'No tasks assigned';
      noTasksMessage.style.textAlign = 'center'; // Center align the message
      userTaskList.appendChild(noTasksMessage);
    } else {
      tasks.forEach(task => {
        var assignedUser = Object.values(users).find(user => user.email === task.assignedTo);
  
        if (assignedUser && assignedUser.email === users[loggedInUser].email) {
          var taskStatus = task.completed ? 'Completed' : 'In Progress';
          var taskStatusClass = task.completed ? 'text-success' : 'text-info';
  
          var taskCard = document.createElement('div');
          taskCard.className = 'card mb-3';
  
          var cardBody = document.createElement('div');
          cardBody.className = 'card-body';
  
          var taskTitle = document.createElement('h5');
          taskTitle.className = 'card-title';
          taskTitle.innerText = `${task.name} (${taskStatus})`;
  
          var taskDescription = document.createElement('p');
          taskDescription.className = 'card-text';
          taskDescription.innerText = task.description;
  
          var taskStart = document.createElement('p');
          taskStart.innerText = `Start: ${task.start}`;
  
          var taskEnd = document.createElement('p');
          taskEnd.innerText = `End: ${task.end}`;
  
          var taskRate = document.createElement('p');
          taskRate.innerText = `Rate: ${task.rate}`;
  
          cardBody.appendChild(taskTitle);
          cardBody.appendChild(taskDescription);
          cardBody.appendChild(taskStart);
          cardBody.appendChild(taskEnd);
          cardBody.appendChild(taskRate);
  
          if (task.completed) {
            var hoursWorked = document.createElement('p');
            hoursWorked.innerText = `Hours Worked: ${task.hoursWorked}`;
  
            var taskCost = document.createElement('p');
            taskCost.innerText = `Cost: $${task.cost}`;
  
            cardBody.appendChild(hoursWorked);
            cardBody.appendChild(taskCost);
          } else {
            var form = document.createElement('form');
            form.onsubmit = function (event) {
              completeTask(event, task.id);
            };
  
            var hoursWorkedLabel = document.createElement('label');
            hoursWorkedLabel.innerText = 'Hours worked:';
  
            var hoursWorkedInput = document.createElement('input');
            hoursWorkedInput.id = `hoursWorked${task.id}`;
            hoursWorkedInput.type = 'number';
            hoursWorkedInput.min = '0';
  
            var submitButton = document.createElement('button');
            submitButton.className = 'btn btn-primary';
            submitButton.type = 'submit';
            submitButton.innerText = 'Mark as Complete';
  
            form.appendChild(hoursWorkedLabel);
            form.appendChild(hoursWorkedInput);
            form.appendChild(submitButton);
  
            cardBody.appendChild(form);
          }
  
          taskCard.appendChild(cardBody);
          userTaskList.appendChild(taskCard);
        }
      });
    }
  }
  
  
  function completeTask(event, taskId) {
    event.preventDefault();
    var hoursWorked = document.getElementById(`hoursWorked${taskId}`).value;
    if (!hoursWorked) {
      alert('Please enter the number of hours worked');
      return;
    }
    var task = tasks.find(task => task.id === taskId);
    task.completed = true;
    task.hoursWorked = parseInt(hoursWorked);
    task.completionDate = new Date().toISOString().split('T')[0]; // get current date in YYYY-MM-DD format
    task.cost = task.rate * task.hoursWorked; // calculate the cost by multiplying rate with hours worked
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadUserDashboard();
  }
  
  
  function editTask(taskId) {
    var task = tasks.find(task => task.id === taskId);
  
    var taskNameInput = document.getElementById('taskName');
    taskNameInput.value = task.name;
  
    var taskDescInput = document.getElementById('taskDesc');
    taskDescInput.value = task.description;
  
    var taskStartDateInput = document.getElementById('taskStartDate');
    taskStartDateInput.value = task.start;
  
    var taskEndDateInput = document.getElementById('taskEndDate');
    taskEndDateInput.value = task.end;
  
    var assignedMemberInput = document.getElementById('assignedMember');
    assignedMemberInput.value = task.assignedTo;
  
    var hourlyRateInput = document.getElementById('hourlyRate');
    hourlyRateInput.value = task.rate;
  
    var createTaskButton = document.querySelector('#createTaskForm button');
    createTaskButton.innerText = 'Update Task';
    createTaskButton.onclick = function () {
      updateTask(taskId);
    };
  }
  
  function updateTask(taskId) {
    var taskName = document.getElementById('taskName').value;
    var taskDesc = document.getElementById('taskDesc').value;
    var taskStartDate = document.getElementById('taskStartDate').value;
    var taskEndDate = document.getElementById('taskEndDate').value;
    var assignedMember = document.getElementById('assignedMember').value;
    var hourlyRate = document.getElementById('hourlyRate').value;
  
    if (!taskName || !taskDesc || !taskStartDate || !taskEndDate || !assignedMember || !hourlyRate) {
      alert('Please fill in all fields');
    } else {
      var task = tasks.find(task => task.id === taskId);
      task.name = taskName;
      task.description = taskDesc;
      task.start = taskStartDate;
      task.end = taskEndDate;
      task.assignedTo = assignedMember;
      task.rate = hourlyRate;
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadAdminDashboard();
      clearTaskForm();
    }
  }
  
  
  function deleteTask(taskId) {
    var confirmDelete = confirm('Are you sure you want to delete this task?');
    if (confirmDelete) {
      tasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      loadAdminDashboard();
    }
  }


  
  function clearTaskForm() {
    var taskNameInput = document.getElementById('taskName');
    var taskDescInput = document.getElementById('taskDesc');
    var taskStartDateInput = document.getElementById('taskStartDate');
    var taskEndDateInput = document.getElementById('taskEndDate');
    var assignedMemberInput = document.getElementById('assignedMember');
    var hourlyRateInput = document.getElementById('hourlyRate');
  // clear the input fields.
    taskNameInput.value = '';
    taskDescInput.value = '';
    taskStartDateInput.value = '';
    taskEndDateInput.value = '';
    assignedMemberInput.value = '';
    hourlyRateInput.value = '';
  
    var createTaskButton = document.querySelector('#createTaskForm button');
    createTaskButton.innerText = 'Create Task';
    createTaskButton.onclick = createTask;
  }
  
  function logout() {
    loggedInUser = '';
    window.location.href = 'index.html';
    localStorage.setItem('loggedInUser', loggedInUser);
    document.getElementById('adminDashboard').style.display = 'none';
    document.getElementById('userDashboard').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
  }
  
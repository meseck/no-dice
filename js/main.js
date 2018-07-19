/**
 * 
 * @summary No Dice! ToDo List
 * @version 2.0
 * @author Fool's Mate <mail@foolsmate.de>
 * @link https://github.com/fools-mate/
 * @updated 2018-05-04
 *
 */


/** GLOBAL VARIABLES
--------------------------------------------------------------------------------*/


//TASKS - UNIQUE ID
var taskUniqueId = 0;

//TASKS - ARRAY & OBJECT
var taskArr = [];
var taskObj = {};

//INPUT VARIABLES
var taskTitleInputVar = '';
var taskContentInputVar = '';
var inputEmpty; //BOOLEAN

//ENTRY CONTAINER VAR
var taskListEntryContainer = document.querySelector('.taskListEntryContainer');

//PICK-RANDOM-TASK TIMEOUT
var pickRandomTaskTimeout;

//RANDOM TASK VARIABLES
var taskCount;
var randomTask; //BOOLEAN
var globalRandomTask = false; //BOOLEAN

//COUNTERS VARIABLES
var taskDoneCounterVar = 0;
var taskDeleteCounterVar = 0;

//IF MOBILE DEVICE (BOOLEAN)
var mobileDevice;

//GET TASK-ARRAY INDEX OF SELECTED ENTRY
var selectedEntryIndex;


/** FUNCTIONS
 --------------------------------------------------------------------------------*/


//CREATE UNIQUE ID

function createUniqueId() {
    taskUniqueId = taskUniqueId + 1;
}


//READ INPUT

function readInput() {
    taskTitleInputVar = taskTitelInput.value;
    taskContentInputVar = taskContentInput.value;

    if (taskTitleInputVar && taskContentInputVar) {
        inputEmpty = false;
    } else {
        inputEmpty = true;
    }
}

var taskTitelInput = document.querySelector('.taskContentTitelInput');
taskTitelInput.addEventListener('input', readInput, false);

var taskContentInput = document.querySelector('.taskContentInput');
taskContentInput.addEventListener('input', readInput, false);


//CREATE TASK LIST (REFRESH)

function createTaskEntryList() {
    taskListEntryContainer.innerHTML = '';

    for (var index = 0; index < taskArr.length; index++) {
        createTaskEntry(index);
    }
}


//CREATE TASK ARRAY & OBJECT

function createTaskArrObj() {

    taskObj = {
        taskTitle: taskTitleInputVar,
        taskContent: taskContentInputVar,
        taskDiv: 'taskListEntryId' + taskUniqueId,
        taskRandom: false
    };

    taskArr.push(taskObj);
    saveStorage();
}


//CLEAR INPUT

function clearInput() {
    taskContentInput.value = '';
    taskTitelInput.value = '';
    taskTitleInputVar = '';
    taskContentInputVar = '';
}


//CREATE TASK ENTRY TITLE

function createTaskEntryTitle() {
    var taskEntryTitle = document.createElement('p');
    taskEntryTitle.setAttribute('class', 'taskListEntryTitle');
    return taskEntryTitle;
}


//CREATE TASK ENTRY CONTENT

function createTaskEntryContent() {
    var taskEntryContent = document.createElement('p');
    taskEntryContent.setAttribute('class', 'taskListEntryContent');
    return taskEntryContent;
}


//CREATE DIV FOR TASK ENTRY

function createTaskEntry(index) {

    var taskEntryArr = taskArr[index];
    var taskTitelObj = taskEntryArr.taskTitle;
    var taskContentObj = taskEntryArr.taskContent;
    var taskDivObj = taskEntryArr.taskDiv;
    var taskRandomObj = taskEntryArr.taskRandom;

    var taskEntry = document.createElement('div');
    taskEntry.setAttribute('id', taskDivObj);

    if (!taskRandomObj) {
        taskEntry.setAttribute('class', 'taskListEntry');
    }

    if (taskRandomObj) {
        taskEntry.setAttribute('class', 'randomTask');
    }

    taskListEntryContainer.appendChild(taskEntry);
    var taskEntryId = document.getElementById(taskDivObj);

    //TASK-ENTRY & MOUSE OVER/OUT

    taskEntryId.addEventListener('mouseover', taskMouseOver, false);
    taskEntryId.addEventListener('mouseout', taskMouseOut, false);
    taskEntryId.addEventListener('click', function () {

        //GET ARRAY INDEX OF SELECTED ENTRY

        selectedEntryIndex = index;

        showTask();
    }, false);


    //DONE BUTTON & EVENTLISTENER
    var taskEntryDoneBtn = document.createElement('div');
    taskEntryId.appendChild(taskEntryDoneBtn);
    taskEntryDoneBtn.setAttribute('class', 'taskEntryDoneBtn');

    if (mobileDevice) {
        taskEntryDoneBtn.style.display = 'grid';
    } else {
        taskEntryDoneBtn.style.display = 'none';
    }

    taskEntryDoneBtn.addEventListener('click', taskDone, true);

    //DELETE BUTTON & EVENTLISTENER

    var taskEntryDeleteBtn = document.createElement('div');

    if (mobileDevice && !taskRandomObj) {
        taskEntryId.appendChild(taskEntryDeleteBtn);
        taskEntryDeleteBtn.setAttribute('class', 'taskEntryDeleteBtn');
        taskEntryDeleteBtn.style.display = 'grid';
        taskEntryDeleteBtn.addEventListener('click', taskDelete, true);

    } else if (!taskRandomObj) {
        taskEntryId.appendChild(taskEntryDeleteBtn);
        taskEntryDeleteBtn.setAttribute('class', 'taskEntryDeleteBtn');
        taskEntryDeleteBtn.style.display = 'none';
        taskEntryDeleteBtn.addEventListener('click', taskDelete, true);

    } else if (mobileDevice && taskRandomObj) {
        taskEntryId.appendChild(taskEntryDeleteBtn);
        taskEntryDeleteBtn.setAttribute('class', 'taskEntryDeleteBtn');
        taskEntryDeleteBtn.style.display = 'none';
        taskEntryDeleteBtn.addEventListener('click', taskDelete, true);
    }

    //CREATE THE LAYOUT OF TASK-ENTRY

    var createTaskEntryTitleFunc = createTaskEntryTitle();
    taskEntryId.appendChild(createTaskEntryTitleFunc);

    var createTaskEntryContentFunc = createTaskEntryContent();
    taskEntryId.appendChild(createTaskEntryContentFunc);

    //TODO DONE

    function taskDone(evtDone) {
        taskArr.splice(index, 1);

        //RESET THE BUTTONS
        $('.backBtn').css('display', 'none');
        $('.editTaskBtn').css('display', 'none');
        $('.createTaskBtn').css('display', 'inline');

        taskEntryId.removeChild(taskEntryDoneBtn);

        if (!taskRandomObj) {
            taskEntryId.removeChild(taskEntryDeleteBtn);
        }

        taskEntryId.removeChild(createTaskEntryContentFunc);
        taskEntryId.setAttribute('class', 'taskListEntryDone');
        setTimeout(function () {
            createTaskEntryList();
            isTaskRandomTrue();
        }, 500);

        taskDoneCounter();
        evtDone.stopPropagation();
    }

    //DELETE THE TASK

    function taskDelete(evtDelete) {
        taskArr.splice(index, 1);

        //RESET THE BUTTONS
        $('.backBtn').css('display', 'none');
        $('.editTaskBtn').css('display', 'none');
        $('.createTaskBtn').css('display', 'inline');

        taskEntryId.removeChild(taskEntryDoneBtn);

        if (taskRandomObj === false) {
            taskEntryId.removeChild(taskEntryDeleteBtn);
        }

        taskEntryId.removeChild(createTaskEntryContentFunc);
        taskEntryId.setAttribute('class', 'taskListEntryDelete');
        setTimeout(function () {
            createTaskEntryList();
            isTaskRandomTrue();
        }, 500);

        taskDeleteCounter();
        evtDelete.stopPropagation();
    }

    //MOUSE OVER - SHOW/HIDE DELETE & DONE BUTTON

    function taskMouseOver() {
        taskEntryDoneBtn.style.display = 'grid';
        if (taskRandomObj === false) {
            taskEntryDeleteBtn.style.display = 'grid';
        }
    }

    function taskMouseOut() {
        if (!mobileDevice) {
            taskEntryDoneBtn.style.display = 'none';
            if (taskRandomObj === false) {
                taskEntryDeleteBtn.style.display = 'none';
            }
        }
    }

    //SHOW TASK WHEN YOU CLICK THE ENTRY

    function showTask() {
        taskContentInput.value = taskContentObj;
        taskTitelInput.value = taskTitelObj;

        taskTitleInputVar = taskTitelObj;
        taskContentInputVar = taskContentObj;

        if (mobileDevice) {
            showHideTaskList('hide');
            readInput();
        }

        //HIDE CREATE-BUTTON & SHOW EDIT-BUTTON

        $('.editTaskBtn').css('display', 'inline');
        $('.createTaskBtn').css('display', 'none');

        //SHOW BACK-BUTTON IN NO-MOBILE DEVICES
        $('.backBtn').css('display', 'inline');
        $('.backBtn').click(function () {
            clearInput();
            $('.backBtn').css('display', 'none');
            $('.editTaskBtn').css('display', 'none');
            $('.createTaskBtn').css('display', 'inline');
            $('.clearTaskBtn').css('display', 'inline');

            readInput();
        });
    }

    createTaskEntryTitleFunc.innerText = taskTitelObj;
    createTaskEntryContentFunc.innerText = taskContentObj;

    saveStorage();
}


//EDIT TASK AFTER YOU SELECTED IT

$('.editTaskBtn').click(function () {

    readInput();

    if (!inputEmpty) {

        taskArr[selectedEntryIndex].taskTitle = taskTitleInputVar;
        taskArr[selectedEntryIndex].taskContent = taskContentInputVar;
        clearInput();
        saveStorage();
        createTaskEntryList();

        $('.editTaskBtn').css('display', 'none');
        $('.backBtn').css('display', 'none');
        $('.createTaskBtn').css('display', 'inline');

        if (mobileDevice) {
            showHideTaskList('show');
        }
    }
});


//STORE TASK INPUT IN OBJECT 

function createTask() {
    createUniqueId();
    createTaskArrObj();
    createTaskEntryList();
    isTaskRandomTrue();
    clearInput();
    checkOverflow();
}

var createTaskBtn = document.querySelector('.createTaskBtn');
createTaskBtn.addEventListener('click', function () {
    if (!inputEmpty) {
        createTask();
        readInput();

        if (mobileDevice) {
            showHideTaskList('show');
            checkOverflow();
        }
    }
}, false);


//CLEAR TASK

function clearTask() {
    taskTitelInput.value = '';
    taskContentInput.value = '';
}

var clearTaskBtn = document.querySelector('.clearTaskBtn');
clearTaskBtn.addEventListener('click', clearTask, false);


//TASK DONE COUNTER

function taskDoneCounter() {
    taskDoneCounterVar++;
    $('.taskDone').text('Tasks done: ' + taskDoneCounterVar);
    saveStorage();
    readStorage();
}


//TASK DELETE COUNTER

function taskDeleteCounter() {
    taskDeleteCounterVar++;
    $('.taskDelete').text('Tasks deleted: ' + taskDeleteCounterVar);
    saveStorage();
    readStorage();
}


//IS ONE VALUE OF TASK-RANDOM TRUE

function isTaskRandomTrue() {
    for (var index = 0; index < taskArr.length; index++) {
        if (taskArr[index].taskRandom === true) {
            globalRandomTask = true;
            return;
        }
    }
    globalRandomTask = false;
}


//DICE BUTTON - PICK A RANDOM TASK

function pickRandomTask() {

    if (taskArr.length > 0 && globalRandomTask === false) {

        globalRandomTask = true;

        var logoEl = document.querySelector('.taskListTitel img');
        logoEl.setAttribute('class', 'logoRotate');

        var rollDiceSound = new Audio('sound/rollDice.mp3');
        rollDiceSound.play();

        var pickRandomTaskInterval = setInterval(pickRandomTaskGenerator, 500);

        setTimeout(function () {
            clearInterval(pickRandomTaskInterval);
        }, 2000);

        setTimeout(function () {
            clearTimeout(pickRandomTaskTimeout);
            taskArr[randomTask].taskRandom = true;
            logoEl.setAttribute('class', '');
            createTaskEntryList();
            saveStorage();
        }, 2000);
    }
}

function pickRandomTaskGenerator() {

    taskCount = taskArr.length - 1;
    randomTask = Math.round(Math.random() * taskCount);

    var randomTaskDivArr = taskArr[randomTask].taskDiv;

    var randomTaskDiv = document.getElementById(randomTaskDivArr);
    randomTaskDiv.setAttribute('class', 'randomTask');

    pickRandomTaskTimeout = setTimeout(function () {
        randomTaskDiv.setAttribute('class', 'taskListEntry');
    }, 125);
}

var diceBtn = document.querySelector('.diceButton');
diceBtn.addEventListener('click', pickRandomTask);


//SHOW SCROLL ARROW WHEN TASK CONTAINER HAS OVERFLOW

function checkOverflow() {

    var scrollDown = document.querySelector('.scrollDown img');

    if (taskListEntryContainer.offsetHeight < taskListEntryContainer.scrollHeight ||
        taskListEntryContainer.offsetWidth < taskListEntryContainer.scrollWidth) {
        scrollDown.style.display = 'block';
        // your element have overflow
    } else {
        scrollDown.style.display = 'none';
    }
}


/** MOBILE FUNCTIONS
 --------------------------------------------------------------------------------*/


//CHECK IF MOBILE DEVICE ON START

function checkMobileDevice() {

    if (window.innerWidth < 480) {
        $('.taskContentWrapper').css('display', 'none');
        $('.backBtn').css('display', 'inline');

        //CREATE NEW BUTTON FOR CREATE TASK

        var createTaskTitleBtn = $('<div>');
        createTaskTitleBtn.addClass('createTaskTitleBtn');
        $('.taskListTitel').append(createTaskTitleBtn);

        $('.createTaskTitleBtn').click(function () {
            showHideTaskList('hide');
        });

        //SHOW BACK-BUTTON

        $('.backBtn').css('display', 'inline');
        $('.backBtn').click(function () {
            showHideTaskList('show');
            clearInput();
        });

        mobileDevice = true;

    } else {

        $('.taskListWrapper').css('display', 'grid');
        $('.taskContentWrapper').css('display', 'inline');
        $('.backBtn').css('display', 'none');

        mobileDevice = false;
    }
}

checkMobileDevice();
window.onresize = function () {
    checkMobileDevice();
};


//SHOW HIDE THE TASKLIST

function showHideTaskList(showHide) {

    if (showHide == 'hide') {
        $('.taskListWrapper').css('display', 'none');
        $('.taskContentWrapper').css('display', 'inline');

    } else if (showHide == 'show') {
        $('.taskListWrapper').css('display', 'grid');
        $('.taskContentWrapper').css('display', 'none');
    }
}


/** LOCAL STORAGE
 --------------------------------------------------------------------------------*/


//SAVE IN LOCAL STORAGE

function saveStorage() {

    //UNIQUE-ID

    var taskUniqueIdData = JSON.stringify(taskUniqueId);
    localStorage.setItem('taskUniqueId', taskUniqueIdData);

    //TASKS

    var taskData = JSON.stringify(taskArr);
    localStorage.setItem('taskStorage', taskData);

    //TASKS DONE

    var taskDoneData = JSON.stringify(taskDoneCounterVar);
    localStorage.setItem('taskDone', taskDoneData);

    //TASKS DELETE

    var taskDeleteData = JSON.stringify(taskDeleteCounterVar);
    localStorage.setItem('taskDelete', taskDeleteData);
}


//READ OUT OF LOCAL STORAGE

function readStorage() {

    var taskUniqueIdData = localStorage.getItem('taskUniqueId');
    var taskData = localStorage.getItem('taskStorage');

    var taskDoneData = localStorage.getItem('taskDone');
    var taskDeleteData = localStorage.getItem('taskDelete');

    if (!taskData) {
        return false;
    } else {

        //UNIQUE-ID

        taskUniqueId = JSON.parse(taskUniqueIdData);

        //TASKS

        taskArr = JSON.parse(taskData);

        //TASKS DONE

        taskDoneCounterVar = JSON.parse(taskDoneData);

        //TASKS DELETE

        taskDeleteCounterVar = JSON.parse(taskDeleteData);

        //TASK INFO TEXT

        $('.taskAll').text('Tasks: ' + taskArr.length);
        $('.taskDone').text('Tasks done: ' + taskDoneCounterVar);
        $('.taskDelete').text('Tasks deleted: ' + taskDeleteCounterVar);
    }
    return true;
}


//RESET ALL LOCAL-STORAGE, INFOS & INPUTS

function resetAll() {

    localStorage.clear();

    taskArr = [];
    taskObj = {};
    taskUniqueId = 0;
    taskDoneCounterVar = 0;
    taskDeleteCounterVar = 0;

    $('.taskAll').text('Tasks: 0');
    $('.taskDone').text('Tasks done: 0');
    $('.taskDelete').text('Tasks deleted: 0');

    createTaskEntryList();
    clearInput();
    checkOverflow();
}


/** SECRET COMMANDS
--------------------------------------------------------------------------------*/


taskTitelInput.addEventListener('input', function () {

    if (taskTitleInputVar === '/secret_commands') {
        console.log('SECRET COMMANDS');
        console.log('/reset all');
        console.log('/reset local_storage');
        console.log('/reset done_counter');
        console.log('/reset delete_counter');
        console.log('/reset no_dice');

        clearHide();
    }

    if (taskTitleInputVar === '/reset all') {
        resetAll();
        clearHide();
    }

    if (taskTitleInputVar === '/reset local_storage') {
        localStorage.removeItem('taskUniqueId');
        localStorage.removeItem('taskStorage');
        taskArr = [];
        taskObj = {};

        $('.taskAll').text('Tasks: ' + taskArr.length);

        createTaskEntryList();
        clearHide();
        checkOverflow();
    }

    if (taskTitleInputVar === '/reset done_counter') {
        localStorage.removeItem('taskDone');

        taskDoneCounterVar = 0;
        $('.taskDone').text('Tasks done: 0');

        clearHide();
    }

    if (taskTitleInputVar === '/reset delete_counter') {
        localStorage.removeItem('taskDelete');

        taskDeleteCounterVar = 0;
        $('.taskDelete').text('Tasks deleted: 0');

        clearHide();
    }

    if (taskTitleInputVar === '/reset no_dice') {
        window.alert('NANA NA! GET YOUR SHIT DONE! :)');
        clearHide();
    }

    saveStorage();
}, false);


//CLEAR INPUT OF CONTENT & HIDE TASKLIST ON MOBILE DEVICES

function clearHide() {

    if (mobileDevice) {
        showHideTaskList('show');
    }

    clearInput();
}


/** CALL FUNCTIONS ON START
--------------------------------------------------------------------------------*/


//READ THE STORAGE - THEN CREATE THE TASK-LIST - AND CHECK FOR OVERFLOW - ON START

readStorage();
createTaskEntryList();
checkOverflow();
isTaskRandomTrue();
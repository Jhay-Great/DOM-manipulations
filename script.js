'use script'
// containers
const main = document.querySelector('main');
const ongoingTodoActivitiesContainer = document.querySelector('.ongoing_todo_activities > section')
const alert = document.querySelector('.feedback');
const body = document.querySelector('body');

// buttons
const displayTodoFormBtn = document.querySelector('.create_todo_activity_btn')
const addTodoBtn = document.querySelector('.create_activity');
const todoForm = document.querySelector('.todo_activity_form');


let todoActivitiesArray = [];
let todoActivityId;

// setting a min date
/**setting min date
 * select the date input
 * get the current day's date
 * set a min attribute to the date input to the current date
 */

// const today = new Date();
// console.log(today);
// const dateInput = document.querySelector('#todo_activity_time-elapsed')
// // dateInput.setAttribute('min', today);
// dateInput.min = today;


// displaying todo form to start creating a todo activity
displayTodoFormBtn.addEventListener('click', function() {
    // display form
    renderHTML(main, 'afterbegin', formMarkup());

    const todoForm = document.querySelector('.todo_activity_form');
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = todoForm.querySelector('input[name="title"]').value;
        const description = todoForm.querySelector('input[name="description"]').value;
        const time = todoForm.querySelector('input[name="time"]').value;
        
        todoForm.parentElement.remove();

        if (!time) {
            return feedback(false, 'Failed to add activity, kindly add date completion')
        }

        feedback(true, 'Successfully created activity');

        // calculating due date using timestamps
        const dueDate = calcDueDate(time);

        const activity = {
            id: generateId(),
            title, 
            description,
            time: dueDate,
            completed: false,
        }
        todoActivitiesArray.push(activity);
        

        document.querySelector('.ongoing_default_paragraph').classList.add('hidden');

        // adding created activity to the DOM
        renderHTML(ongoingTodoActivitiesContainer, 'beforeend', activityMarkup(activity))
    })

})


main.addEventListener('click', function(e) {
    // close modal functionality
    if (e.target.classList.contains('form_container')) {
        e.target.remove();
        return;
    }

    const parent = e.target.closest('.activity_container');
    // delete functionality
    if (e.target.closest('.todo_activity_delete')) {
        displayDefaultText(parent, document.querySelector('.ongoing_default_paragraph'));

        displayDefaultText(parent, document.querySelector('.completed_default_paragraph'))

        deleteActivity(parent);
        return;
    }

    // completed todo activities
    if (e.target.closest('.todo_activity_completed')) {
        const id = +parent.dataset.key;
        const selectedActivity = todoActivitiesArray.find(activity => activity.id === id);
        
        hideElement('.completed_default_paragraph');
        
        const completedActivitiesContainer = document.querySelector('.completed_todo_activities > section');
        
        // unique scenario
        renderHTML(completedActivitiesContainer, 'beforeend', completedActivityMarkup(selectedActivity));
        // renderHTML(completedActivitiesContainer, 'beforeend', activityMarkup(selectedActivity));

        /**removing activity from ongoing */
        displayDefaultText(parent, document.querySelector('.ongoing_default_paragraph'));
            
        deleteActivity(parent);
    }

    // update / edit existing todo activity
    if (e.target.closest('.todo_activity_edit')) {
        e.preventDefault();

        // getting todo id
        todoActivityId = e.target.closest('.activity_container').dataset.key;
        
        // find element by id in array
        const todoActivity = todoActivitiesArray.find(element => element.id === +todoActivityId);

        const {title, description, time} = todoActivity;
        const date = convertDaysToDate(time);
        
    renderHTML(main, 'afterbegin', formMarkup(title, description, date, true));

    }

    // when the update button is clicked
    if (e.target.classList.contains('form_update-btn')) {
        e.preventDefault();

        const title = document.querySelector('input[name="title"]');
        const description = document.querySelector('input[name="description"]');
        const time = document.querySelector('input[name="time"]');

        const data = {};
        data['title'] = title.value;
        data['description'] = description.value;
        data['time'] = calcDueDate(time.value); 

        // successful feedback on editing
        feedback(true, 'Successfully updated activity');
        
        // UPDATING THE UI
        this.querySelectorAll('.activity_container').forEach(activity => {
            if(activity.dataset.key === todoActivityId) {
                activity.querySelector('.activity_title').textContent = title.value;
                activity.querySelector('.activity_duration').textContent = data['time'];
                activity.querySelector('.activity_description').textContent = description.value;
            }
        })

        // UPDATING THE ARRAY DS
        const activity = todoActivitiesArray.find(element => element.id === Number(todoActivityId))
        const index = todoActivitiesArray.findIndex(element => element.id === +todoActivityId);
        
        const updateActivity = {
            ...activity,
            ...data,
        };

        todoActivitiesArray.splice(index, 1, updateActivity)
        
        e.target.closest('.form_container').remove();
    }

    // sorting functionality
    if (e.currentTarget.querySelector('.sorting-btn')) {
        e.target.closest('.sorting-btn')?.nextElementSibling.classList.toggle('hidden');
        e.target.closest('.sorting-btn')?.classList.toggle('active');

        
        if (e.target.classList.contains('ascending-order')) {
            sortElements(todoActivitiesArray, 'time').forEach(element => {
                main.querySelector('.activity_container').remove()
                
                renderHTML(ongoingTodoActivitiesContainer, 'beforeend', activityMarkup(element));
                })
                
        }
    }


})


// on no ongoing activity
if (todoActivitiesArray.length === 0) {
    document.querySelector('.ongoing_default_paragraph').classList.remove('hidden');
}

// completed activity
if (todoActivitiesArray.some(element => element.completed === true) === false) {
    document.querySelector('.completed_default_paragraph').classList.remove('hidden');
}



// HELPER FUNCTIONS
// normalizing date to midnight
const normalizeToMidnight = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// calculating due date
const calcDueDate = function (time) {
    // console.log('time in calc dd: ', time);
    
    const today = new Date();
    const normalizeToday = normalizeToMidnight(today);
    
    const futureDate = new Date(time);
    const normalizedFutureDate = normalizeToMidnight(futureDate);
    
    const timeDifference = normalizedFutureDate - normalizeToday;
    
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

}

const convertDaysToDate = function(time) {
    const today = new Date();
    const futureDate = new Date(today.getTime() + time * 24 * 60 * 60 * 1000);

    // console.log('the future date: ', futureDate);
    // return (futureDate.getTime(), futureDate.getFullYear(), futureDate.getMonth());

    const year = futureDate.getFullYear();
    const month = (futureDate.getMonth() + 1).toString().padStart(2, 0);
    const day = futureDate.getDate().toString().padStart(2, 0);
    const hour = futureDate.getHours().toString().padStart(2, 0);
    const minutes = futureDate.getMinutes().toString().padStart(2, 0);

    // console.log({year, month, day, hour, minutes})

    // console.log(`${year}-${month}-${day}T${hour}:${minutes}`);
    return `${year}-${month}-${day}T${hour}:${minutes}`;

    // console.log(format);
    
    
    // const dateTime = `${futureDate.getFullYear()}-${futureDate.getMonth()}-${futureDate.getDate()}T${futureDate.getHours()}:${futureDate.getMinutes()}`;
    // // console.log(dateTime);
    // return dateTime;
    // // return {
    // //     day: futureDate.getDate(),
    // //     month: futureDate.getMonth() + 1,
    // //     year: futureDate.getFullYear(),
    // //     hour: futureDate.getHours(),
    // //     minutes: futureDate.getMinutes()
    // // }
};

// he specified value "1" does not conform to the required format.  The format is "yyyy-MM-ddThh:mm" followed by optional ":ss" or ":ss.SSS".

// console.log(new Date(2 * (1000 * 60 * 60 * 24)))
// console.log(convertDaysToDate(2));




// adding dynamic markup to the DOM
const renderHTML = function(container, position, html) {
    container.insertAdjacentHTML(position, html);
}



const sortElements = function(array, property, ascending = true) {
    return [...array].sort((a, b) => {
        let aValue = a[property];
        let bValue = b[property];

        // Convert to numbers if property is 'time'
        if (property === 'time') {
            aValue = Number(aValue);
            bValue = Number(bValue);
        }

        if (ascending) {
            return (aValue > bValue) ? 1 : -1;
        } else {
            return (aValue < bValue) ? 1 : -1;
        }
    });
}

// generating id
const generateId = (function() {
    let previousTimestamp;

    return function() {
        const timestamps = Date.now();
        let format = Number(timestamps + '0');
        
        if (previousTimestamp === format) {
            
            const id = format + 1;
            return id;
        }
            
        previousTimestamp = format;
        return format;

    }
}) ();


// Todo Activity markup
const formMarkup = function(title='', description='', date='', update=false) {
    const htmlMarkup = 
    `
        <section class="form_container">
            <form class="todo_activity_form">
                <div class="todo_activity_title">
                    <input type="text" name="title" value="${title}" placeholder="Enter your activity title">
                </div>
                <div class="todo_activity_description">
                    <input type="text" name="description" value="${description}" placeholder="Enter a description for your activity">
                </div>
                <input type="datetime-local" name="time" value="${date}" id="todo_activity_time-elapsed">
                ${update ? '<button class="form_update-btn">Update activity</button>' : '<button class="form_activity_create-btn">Create activity</button>' }
            </form>
        </section>
    `;
    return htmlMarkup;
}

// const formMarkup = function() {
//     const htmlMarkup = 
//     `
//         <section class="form_container">
//             <form class="todo_activity_form">
//                 <div class="todo_activity_title">
//                     <input type="text" name="title" placeholder="Enter your activity title">
//                 </div>
//                 <div class="todo_activity_description">
//                     <input type="text" name="description" placeholder="Enter a description for your activity">
//                 </div>
//                 <input type="datetime-local" name="time" id="todo_activity_time-elapsed">
//                 <button class="form_activity_create-btn">Create activity</button>
//             </form>
//         </section>
//     `;
//     return htmlMarkup;
// }

const activityMarkup = function(activity) {
    const html = 
        `
            <div class="activity_container" data-key=${activity.id}>
                <div class="display_flex">

                    <p class="activity_title">${activity.title}</p>
                    <p class="activity_duration">${activity.time}</p>
                </div>
                <div class="display_flex">
                    <button class="todo_activity_completed">
                        <img src="./assets/check.svg" alt="check svg icon">
                    </button>
                    <button class="todo_activity_delete">
                        <img src="./assets/delete.svg" alt="delete svg icon">
                    </button>
                    <button class="todo_activity_edit">
                        <img src="./assets/edit.svg" alt="delete svg icon">
                    </button>
                </div>
                <p class="activity_description hidden">${activity.description}</p>
            </div>
        `;
    return html;
}

// const aActivityMarkup = function(activity, completed=false) {
//     const html = 
//         `
//             <div class="activity_container" data-key=${activity.id}>
//                 <div class="display_flex">

//                     <p class="activity_title">${activity.title}</p>
//                     <p class="activity_duration">${activity.time}</p>
//                 </div>
//                 <div class="display_flex">
//                     ${completed && <button class="todo_activity_completed">
//                         <img src="./assets/check.svg" alt="check svg icon" />
//                     </button>}
//                     <button class="todo_activity_delete">
//                         <img src="./assets/delete.svg" alt="delete svg icon">
//                     </button>
//                     <button class="todo_activity_edit">
//                         <img src="./assets/edit.svg" alt="delete svg icon">
//                     </button>
//                 </div>
//                 <p class="activity_description hidden">${activity.description}</p>
//             </div>
//         `;
//     return html;
// }


const completedActivityMarkup = function(activity) {
    const html = 
        `
            <div class="activity_container" data-key=${activity.id}>
                <div class="display_flex">
                    <p class="activity_title">${activity.title}</p>
                    <p class="activity_duration">${activity.time}</p>
                </div>
                <div class="display_flex">
                    <button class="todo_activity_delete">
                        <img src="./assets/delete.svg" alt="delete svg icon">
                    </button>
                </div>
                <p class="activity_description hidden">${activity.description}</p>
            </div>
        `;
    return html;
}

const deleteActivity = function(selector) {
    const word = selector.querySelector('.activity_title').textContent;

    const filteredTodoActivity = todoActivitiesArray.filter(activity => activity.title !== word);
    // delete element from array
        todoActivitiesArray = [...filteredTodoActivity];
        
        // delete element from the DOM
        selector.remove();
}

const displayDefaultText = function(parentSelector, childSelector) {
    if (parentSelector.closest('section').children.length < 2) {
        childSelector.classList.remove('hidden');
    }
    return;
}

const hideElement = function(selectorClassName) {
    document.querySelector(selectorClassName).classList.add('hidden');
}

const feedback = function(response, comment) {
    const positive = alert.querySelector('.positive_feedback');
    const negative = alert.querySelector('.negative_feedback')

    const failedResponse = negative.querySelector('p');
    const successResponse = positive.querySelector('p');

    alert.classList.remove('hidden');
    alert.classList.add('hide_alert');

    if (!response) {
        failedResponse.textContent = comment;
        negative.classList.remove('hidden');
        setTimeout(() => {
            alert.classList.add('hidden');
            alert.classList.remove('hide_alert');
            negative.classList.add('hidden');
        }, 5000);
        return;
    }
    
    successResponse.textContent = comment;
    positive.classList.remove('hidden');
    setTimeout(() => {
        positive.classList.add('hidden');
        alert.classList.add('hidden');
        alert.classList.remove('hide_alert');
    }, 3200);
    return;

}



        

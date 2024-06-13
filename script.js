'use script'
// containers
const main = document.querySelector('main');
const ongoingTodoActivitiesContainer = document.querySelector('.ongoing_todo_activities > section')

// buttons
const displayTodoFormBtn = document.querySelector('.create_todo_activity_btn')
const addTodoBtn = document.querySelector('.create_activity');
const todoForm = document.querySelector('.todo_activity_form');


let todoActivitiesArray = [];

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
    const htmlMarkup = 
    `
        <section class="form_container">
            <form class="todo_activity_form">
                <div class="todo_activity_title">
                    <input type="text" name="title" placeholder="Enter your activity title">
                </div>
                <div class="todo_activity_description">
                    <input type="text" name="description" placeholder="Enter a description for your activity">
                </div>
                <input type="datetime-local" name="time" id="todo_activity_time-elapsed">
                <button class="todo_activity_form_activity">Create activity</button>
            </form>
        </section>
    `;
    renderHTML(main, 'afterbegin', htmlMarkup);

    const todoForm = document.querySelector('.todo_activity_form');
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = todoForm.querySelector('input[name="title"]').value;
        const description = todoForm.querySelector('input[name="description"]').value;
        const time = todoForm.querySelector('input[name="time"]').value;

        // calculating due date using timestamps
        const dueDate = calcDueDate(time);

        const activity = {
            title, 
            description,
            time: dueDate,
            completed: false,
        }
        todoActivitiesArray.push(activity);
        
        todoForm.parentElement.remove();

        const html = 
        `
            <div class="activity_container">
                <div class="display_flex">
                    <p class="todo_activity_title">${activity.title}</p>
                    <p class="todo_activity_duration">${activity.time}</p>
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
                <p class="todo_activity_description hidden">${activity.description}</p>
            </div>
        `;


        document.querySelector('.ongoing_default_paragraph').classList.add('hidden');
        renderHTML(ongoingTodoActivitiesContainer, 'beforeend', html)
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
        const word = parent.querySelector('.todo_activity_title').textContent;

        // removing element from the array
        const arr = todoActivitiesArray.filter(activity => activity.title !== word);
        todoActivitiesArray = [...arr];

        // delete element from the DOM
        if (parent.closest('section').children.length < 2) {
            document.querySelector('.ongoing_default_paragraph').classList.remove('hidden');
        }

        parent.remove();
        return;
    }

    // completed status functionality
    if (e.target.closest('.todo_activity_completed')) {
        const word = parent.querySelector('.todo_activity_title').textContent;

        const html = 
        `
            <div class="activity_container">
                <p class="todo_activity_title">${word}</p>
                <button class="todo_activity_completed">
                    <img src="./assets/check.svg" alt="check svg icon">
                </button>
                <button class="todo_activity_delete">
                    <img src="./assets/delete.svg" alt="delete svg icon">
                </button>
                <button class="todo_activity_edit"></button>
            </div>
        `;
        document.querySelector('.completed_default_paragraph').classList.add('hidden');
        
        renderHTML(document.querySelector('.completed_todo_activities'), 'beforeend', html);

        if (parent.closest('section').children.length < 2) {
            document.querySelector('.ongoing_default_paragraph').classList.remove('hidden');
        }

        e.target.closest('.activity_container').remove();
    }

    // update / edit existing todo activity
    if (e.target.closest('.todo_activity_edit')) {
        console.log('editing...');

        const title = parent.querySelector('.todo_activity_title').textContent;
        const description = parent.querySelector('.todo_activity_title').textContent;
        const time = parent.querySelector('.todo_activity_duration').textContent;

        const duration = Date.parse(time);


        const htmlMarkup = 
    `
        <section class="form_container">
            <form class="todo_activity_form">
                <div class="todo_activity_title">
                    <input type="text" name="title" value="${title}" placeholder="Enter your activity title">
                </div>
                <div class="todo_activity_description">
                    <input type="text" name="description" placeholder="Enter a description for your activity">
                </div>
                <input type="datetime-local" name="time" value="${time}" id="todo_activity_time-elapsed">
                <button class="todo_activity_form_activity">Create activity</button>
            </form>
        </section>
    `;
    renderHTML(main, 'afterbegin', htmlMarkup);

        
    }

    // sorting functionality
    if (e.currentTarget.querySelector('.sorting-btn')) {
        e.currentTarget.querySelector('.sort_menu').classList.toggle('hidden');
        e.target.closest('.sorting-btn')?.classList.toggle('active');

        if (e.target.classList.contains('ascending-order')) {
            console.log('ew')
            sortElements(todoActivitiesArray, 'time').forEach(element => {
                main.querySelector('.activity_container').remove()
                
                const html = 
                `
                    <div class="activity_container">
                        <p class="todo_activity_title">${element.title}</p>
                        <p class="todo_activity_duration">${element.time}</p>
                        <button class="todo_activity_completed">
                            <img src="./assets/check.svg" alt="check svg icon">
                        </button>
                        <button class="todo_activity_delete">
                            <img src="./assets/delete.svg" alt="delete svg icon">
                        </button>
                        <button class="todo_activity_edit"></button>
                    </div>
                `;
                renderHTML(ongoingTodoActivitiesContainer, 'beforeend', html);
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




// normalizing date to midnight
const normalizeToMidnight = date => new Date(date.getFullYear(), date.getMonth(), date.getDate());

// calculating due date
const calcDueDate = function (time) {
    const today = new Date();
    const normalizeToday = normalizeToMidnight(today);
    
    const futureDate = new Date(time);
    const normalizedFutureDate = normalizeToMidnight(futureDate);
    
    const timeDifference = normalizedFutureDate - normalizeToday;
    
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

}
// adding dynamic markup to the DOM
const renderHTML = function(container, position, html) {
    container.insertAdjacentHTML(position, html);
}



const sortElements = function(array, property, ascending = true) {
    console.log(property);
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
        

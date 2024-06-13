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
    main.insertAdjacentHTML('afterbegin', htmlMarkup);

    const todoForm = document.querySelector('.todo_activity_form');
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const title = todoForm.querySelector('input[name="title"]').value;
        const description = todoForm.querySelector('input[name="description"]').value;
        const time = todoForm.querySelector('input[name="time"]').value;

        const activity = {
            title, 
            description,
            time,
            completed: false,
        }
        todoActivitiesArray.push(activity);
        
        todoForm.parentElement.remove();

        const html = 
        `
            <div class="activity_container">
                <div class="todo_activity_completed"></div>
                <p class="todo_activity_title">${activity.title}</p>
                <div class="todo_activity_duration">${activity.time}</div>
                <button class="todo_activity_edit"></button>
                <button class="todo_activity_delete">
                    <img src="./assets/delete.svg" alt="delete svg icon">
                </button>
            </div>
        `;


        ongoingTodoActivitiesContainer.insertAdjacentHTML('beforeend', html);        
    })

})


main.addEventListener('click', function(e) {
    if (e.target.classList.contains('form_container')) {
        e.target.remove();
        return;
    }

    if (e.target.closest('.todo_activity_delete')) {
        const parent = e.target.closest('.activity_container');
        const word = parent.querySelector('.todo_activity_title').textContent;

        // removing element from the array
        const arr = todoActivitiesArray.filter(activity => activity.title !== word);
        todoActivitiesArray = [...arr];

        // delete element from the DOM
        parent.remove();
    }

})


// display todo 
// console.log(ongoingTodoActivitiesContainer.querySelectorAll('section > div'))


// on no ongoing activity

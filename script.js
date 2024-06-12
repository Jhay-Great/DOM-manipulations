'use script'
// containers
const main = document.querySelector('main');
const ongoingTodoActivitiesContainer = document.querySelector('.ongoing_todo_activities > section')

// buttons
const displayTodoFormBtn = document.querySelector('.create_todo_activity_btn')
const addTodoBtn = document.querySelector('.create_activity');
const todoForm = document.querySelector('.todo_activity_form');

// 


const todoActivitiesArray = [];

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
        console.log(title, description, time);

        const activity = {
            title, description, time
        }
        todoActivitiesArray.push(activity);
        console.log(activity, todoActivitiesArray);

        todoForm.parentElement.remove();

        
        // // selecting all values from input fields
        // const inputFields = document.querySelectorAll('input');
        // // looping through the input fields
        // const currentTodoActivity = {};
        // // inputFields.forEach(field => {
        // //     currentTodoActivity[field.name] = field.value;
            
        // // })
        // todoActivitiesArray.push(currentTodoActivity);
        // console.log(todoActivitiesArray, currentTodoActivity);

        // // on successful submission remove else maintain
        // e.currentTarget.parentElement.remove();
    })

    
    // const formParentContainer = document.querySelector('.form_container');
    
    // console.log(formParentContainer)

    // formParentContainer.addEventListener('click', function() {
    //     console.log('w')
    // })

    

})


main.addEventListener('click', function(e) {
    if (e.target.classList.contains('form_container')) {
        e.target.remove();
        return;
    }

    // todo form submission
    // const todoForm = document.querySelector('.todo_activity_form');
    // todoForm?.addEventListener('submit', function(e) {
    //     e.preventDefault();

    //     const title = todoForm.querySelector('input[name="title"]').value;
    //     const description = todoForm.querySelector('input[name="description"]').value;
    //     const time = todoForm.querySelector('input[name="time"]').value;
    //     console.log(title, description, time);

    //     const activity = {
    //         title, description, time
    //     }
    //     console.log(activity);
        
    //     // // selecting all values from input fields
    //     // const inputFields = document.querySelectorAll('input');
    //     // // looping through the input fields
    //     // const currentTodoActivity = {};
    //     // // inputFields.forEach(field => {
    //     // //     currentTodoActivity[field.name] = field.value;
            
    //     // // })
    //     // todoActivitiesArray.push(currentTodoActivity);
    //     // console.log(todoActivitiesArray, currentTodoActivity);

    //     // // on successful submission remove else maintain
    //     // e.currentTarget.parentElement.remove();
    // })
})
    
    
    
// addTodoBtn?.addEventListener('click', function(e) {
//     console.log('s')
//     e.preventDefault();
    
//     // selecting all values from input fields
//     const inputFields = document.querySelectorAll('input');
//     // looping through the input fields
//     const currentTodoActivity = {};
//     inputFields.forEach(field => {
//         currentTodoActivity[field.name] = field.value;
        
//     })
//     todoActivitiesArray.push(currentTodoActivity);
//     console.log(todoActivitiesArray, currentTodoActivity);
    
//     // on successful submission remove else maintain
//     e.currentTarget.parentElement.remove();
// })


// ONGOING TODO LISTS
ongoingTodoActivitiesContainer
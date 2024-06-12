'use script'
const addTodoBtn = document.querySelector('.create_activity');
const todoForm = document.querySelector('.todo_activity_form');


const todoActivitiesArray = [];

// setting a min date
/**setting min date
 * select the date input
 * get the current day's date
 * set a min attribute to the date input to the current date
 */

const today = new Date();
console.log(today);
const dateInput = document.querySelector('#todo_activity_time-elapsed')
// dateInput.setAttribute('min', today);
dateInput.min = today;


todoForm.addEventListener('submit', function(e) {
    e.preventDefault(e);
    
    // selecting all values from input fields
    const inputFields = document.querySelectorAll('input');
    // looping through the input fields
    const currentTodoActivity = {};
    inputFields.forEach(field => {
        currentTodoActivity[field.name] = field.value;
        
    })
    todoActivitiesArray.push(currentTodoActivity);
    console.log(todoActivitiesArray);
})
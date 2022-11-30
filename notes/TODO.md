- LazyPortable doc
    - LazyParsing
    - LazyPattern
    - LazyRule
    - LazyText
- LazyClient doc
    - LazyEditorArea

nwTask.ondragstart = drag;
t.ondragover = allowDrop;
t.ondrop = drop;

function allowDrop(ev) {
    ev.preventDefault();
}
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.getAttribute('value'));
}  
function drop(ev) {
    ev.preventDefault();
    let id = Number(ev.dataTransfer.getData("text"));
    let TARGET = ev.target;
    let CONTENT = ev.target.getAttribute('content');
    if(!CONTENT) // It's not the container's target but some inside element..
    {
        CONTENT = ev.target.closest('.task').parentNode.getAttribute('content'); // Get parent container's attribute
        TARGET = document.querySelector(`.${CONTENT === 'todo' ? 'toDo' : CONTENT}_tasks`); // Change the target to the container
    }
    for(let i = 0; i < userTasks.length; i++)
    {
        if(userTasks[i].id == id)
        {
            let category = userTasks[i].Category;
            userTasks[i].setCategory(CONTENT);
            TARGET.appendChild(document.querySelector(`.${category}_tasks > .task[value='${id}']`));
            saveDatas();
            break;
        }
    }
}
$(() => {

    let todoList = $('#todo-list');
    let addButton = $('#add-button');
    let input = $('#input');
    let isEdit = false;
    getData();

    addButton.click((event) => {
        event.preventDefault();
        let text = input.val().trim();

        if(text) {
            let a=$.ajax({
                method: 'POST',
                url: 'http://localhost:5555/todos',
                data: {
                    title: text,
                }
            }).done(populateToDoList);
            a.done(getData);
        }
    });

    
    function editOperation(event, id) {
        event.preventDefault();

        if(isEdit === true)
            return;

        isEdit = true;
        let element = $(event.target).parent().closest('.item');
       // console.log(id);
        element.replaceWith(createEditItemForm(id, updateTextOperation));
    }

    function updateTextOperation(event, id, text) {
        event.preventDefault();
     //   console.log(id);
        $.ajax({
            url: 'http://localhost:5555/todos/'+id,
            method: 'PUT',
            data: { title: text }
        }).done(() => { 
            getData();
        });
    }

    function updateDoneOperation(event, id, text, done) {
        event.preventDefault();
        $.ajax({
            url: 'http://localhost:5555/todos/'+id,
            method: 'PUT',
            data: { title: text, done: done }
        }).done(() => { 
            getData();
        });
    }

    function removeOperation(event, id) {
        event.preventDefault();

        $.ajax({
            url: 'http://localhost:5555/todos/' + id,
            method: 'DELETE'
        }).done(() => {
        //    console.log("DELETE");
            getData();
        });
    }

    function getData() {
        isEdit = false;
        $.ajax({
            url: 'http://localhost:5555/todos',
            method: 'GET'
        }).done(populateToDoList);
    }

    function populateToDoList(res) {
        todoList.empty();
        let newarray = [];
        for(let i = 0; i < res.length; i++) {
            if(res[i].done === false)
                newarray.push(res[i]);
        }

        for(let i = 0; i < res.length; i++) {
            if(res[i].done === true)
                newarray.push(res[i]);
        }


        for(let i = 0; i < newarray.length; i++) {
            let newItem = createItem(newarray[i], removeOperation, editOperation, updateDoneOperation);
            todoList.append(newItem);
        }
    }
});
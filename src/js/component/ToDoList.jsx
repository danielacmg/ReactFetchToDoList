import React, {useState, useEffect} from "react";

const TodoList = () => {
	const [inputToDo, setInputToDo ] = useState('');
	const [toDoArr, setToDoArr] = useState(["Uno", "Dos"])
  // useState([{label:"Whatever1", done: false}, {label:"Whatever2", done: false}, {label:"More to do", done: false}]);

  ///////////////////// To-Do functions /////////////////////////////////

  const showDelete = (id) =>{   //to show delete buttons
		document.getElementById(id).className ="col-1";
    };
	const hideDelete = (id) =>{   //to hide delete buttons
		document.getElementById(id).className ="col-1 d-none";
    };
  
  const DoNothing = () =>{ }

  const fetchTodos = () =>{
    fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg', {
      method: "GET",
      // body: JSON.stringify(todos),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => {
        console.log(resp.ok); // will be true if the response is successfull
        console.log(resp.status); // the status code = 200 or code = 400 etc.
        console.log(resp.text()); // will try return the exact result as string
        return resp.json(); // (returns promise) will try to parse the result as json as return a promise that you can .then for results
    })
    .then(data => {
      console.log("fetched data: ");
      console.log(data);

      let toDoItems = data;
      console.log("lo que traigo...")
      console.log(toDoItems);

      setToDoArr(toDoItems);  //To update to do list view
      console.log("a ver q guardo? ")
      console.log(toDoArr);
        //here is were your code should start after the fetch finishes
        console.log(data); //this will print on the console the exact object received from the server
    })
    .catch(error => {
        //error handling
        console.log(error);
    });
  }



	const addToDo = (e, newToDo) =>{   //to add a new item on ToDo list
    
    if(!toDoArr.length>0){ // To create a new list
      createTodoList();
    }

    setToDoArr ([...toDoArr, newToDo]);  //To add the new item
    console.log(toDoArr);
    setInputToDo(""); // To clear input after adding new item

    console.log("Inserting new item... ") //Testing...
    console.log(toDoArr);

      fetch("https://assets.breatheco.de/apis/fake/todos/user/danielacmg",{
        method: 'PUT', 
        body: JSON.stringify(toDoArr), // Sending the array with the new item
        headers:{
          'Content-Type': 'application/json'
        }
      })
      
      .then(response => {
          var contentType = response.headers.get("content-type");
          if(contentType && contentType.includes("application/json")) {
            return response.json();
          }
          throw new TypeError("Sorry, There's no JSON here!");
        })
        .then(jsonifiedResponse => { /* do whatever you want with the jsonified response */ 
           let toDoItems = jsonifiedResponse;
           console.log("adding JSonresponse: ");
           console.log(toDoItems);
          // setToDoArr(toDoItems);
          // console.log("lo que traigo...")
          // console.log(toDoItems);
          // setToDoArr(
          //     toDoItems.map((item, index) => {
          //     return item; 
          //   })
          //   );
          
          fetchTodos(); //To update To do list view

          //document.getElementById("demo").innerHTML = retrivedData.birth_year;
           console.log("items after fetch adding: ");
            console.log(toDoArr);
      
      
      })
        .catch(error => console.log(error));		  
        
    };



	const deleteToDo = (i) =>{   //to delete an item from ToDo list
		setToDoArr (toDoArr.filter((item, index) => i!==index)); 
    
    console.log("Deleting new item... ")
    console.log(toDoArr);

      fetch("https://assets.breatheco.de/apis/fake/todos/user/danielacmg",{
        method: 'PUT', // or 'POST'
        body: JSON.stringify(toDoArr), // data can be a `string` or  an {object} which comes from somewhere further above in our application
        headers:{
          'Content-Type': 'application/json'
        }
      })
      
      .then(response => {
          var contentType = response.headers.get("content-type");
          if(contentType && contentType.includes("application/json")) {
            return response.json();
          }
          throw new TypeError("Sorry, There's no JSON here!");
        })
        .then(jsonifiedResponse => { /* do whatever you want with the jsonified response */ 
          let toDoItems = jsonifiedResponse;          
          fetchTodos();
          console.log("JSON after deleting: ");
          console.log(toDoItems);
      
      
      })
        .catch(error => console.log(error));
        
    };
   
    // useEffect(() => {
    //   fetchTodos();
    // }, []);

	const createTodoList = () =>{   //Create a new ToDo list
    
      fetch("https://assets.breatheco.de/apis/fake/todos/user/danielacmg",{
        method: 'POST', // or 'POST'
        body: JSON.stringify(toDoArr), 
        headers:{
          'Content-Type': 'application/json'
        }
      })
      
      .then(response => {
          var contentType = response.headers.get("content-type");
          if(contentType && contentType.includes("application/json")) {
            return response.json();
          }
          throw new TypeError("Sorry, There's no JSON here!");
        })
        .then(jsonifiedResponse => { /* do whatever you want with the jsonified response */ 
          let toDoItems = jsonifiedResponse;
          //document.getElementById("demo").innerHTML = retrivedData.birth_year;
          console.log("Creating a new To-Do list...")
            console.log(toDoItems);
      
      
      })
        .catch(error => console.log(error));

    };

  ////////////////////////////////End Of Functions//////////////////////////////////////

    



        /////////////// HTML /////////////////
        return (
          <div className="container-fluid bg-secondary p-2">
            <h1 className="text-center text-info">TO-DO's</h1>            
      
            <ul className="list-group list-group-flush text-light">
              <li className="list-group-item list-group-item-dark" >
                <div className="form">
                  <div className="row">
                    <div className="col">
                      <input type="text" className="form-control-plaintext" onChange={e => setInputToDo(e.target.value)} value={inputToDo} placeholder="To do..." onKeyDown={e => ((e.key === 'Enter' && e.target.value !=="") ? addToDo(e, inputToDo): null) } autoFocus/>
                    </div>							
                  </div>
                </div>
              </li>
              {toDoArr.length ? toDoArr.map((toDoItem, i) => (
                <li className="list-group-item list-group-item-action list-group-item-dark" key={i} onMouseOver={()=>showDelete(i)}  onMouseOut={()=>hideDelete(i)} >
                  <div className="form">
                    <div className="row">
                      <div className="col">
                        <input type="text"  className="form-control-plaintext" value={toDoItem} />
                      </div>
                      <div className="col-1 d-none" id={i}>
                        <button className="btn btn-outline-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete To-do" onClick={()=>deleteToDo(i)}>X</button>
                      </div>
                      
                    </div>
                  </div>
                </li>
               )) : <p onLoad={() => createTodoList()} className="m-2">There's no tasks on the list, Let's add a task!</p>
               }
              
            </ul>
            </div>
        );
      };
      


export default TodoList;
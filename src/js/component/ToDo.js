import React, {useState, useEffect} from "react";

const ToDo = () => {

  const [inputToDo, setInputToDo ] = useState('');
	const [toDoArr, setToDoArr] = useState([]);
  // useState([{label:"Whatever1", done: false}, {label:"Whatever2", done: false}, {label:"More to do", done: false}]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const showDelete = (id) =>{   //to show delete buttons
		document.getElementById(id).className ="col-1";
    };
	const hideDelete = (id) =>{   //to hide delete buttons
		document.getElementById(id).className ="col-1 d-none";
    };
  
    const fetchTodos = () =>{  

        fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg')
        .then((response) => {
          if (!response.ok) {
            if (response.status=='404'){
              createTodoList();
            }else{
              throw new Error('This is an HTTP error: The status is '+ response.status);
            }            
          }
          return response.json();
        })
        .then((actualData) => {  		
          setToDoArr(actualData);	console.log("Trayendo Lista... "); console.log(actualData);            
          setError(null);
        })
        .catch((err) => {
          setError(err.message); setToDoArr([]);
        })
        .finally(() => {
          setLoading(false);
        });
    
    }

    const createTodoList = (newToDo) =>{  
      let auxArr = [{"label":newToDo, "done": false}];  
      fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg',{
        method: "POST",
        body: JSON.stringify(auxArr),
        headers: {
          "Content-Type": "application/json"
        }
      })

      .then((response) => {
        if (!response.ok) {
          throw new Error('This is an HTTP error: The status is '+ response.status);
        }
        return response.json();
      })
      .then((actualData) => {  		
        setToDoArr([...toDoArr, {"label":newToDo, "done":false}]);	console.log("Creating List... "); console.log(actualData);        
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

    const addToDo = (newToDo) =>{  
      
      if(!toDoArr.length>0){ // To create a new list
        createTodoList(newToDo);
      }else{

        fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg',{
          method: "PUT",
          body: JSON.stringify([...toDoArr, {"label":newToDo, "done":false}]),
          headers: {
            "Content-Type": "application/json"
          }
        })

        .then((response) => {
          if (!response.ok) {
            throw new Error('This is an HTTP error: The status is '+ response.status);
          }
          return response.json();
        })
        .then((actualData) => {  		
          setToDoArr([...toDoArr, {"label":newToDo, "done":false}]);	console.log("Adding... "); console.log(actualData);            
          setError(null);
        })
        .catch((err) => {
          setError(err.message); setToDoArr([]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
    setInputToDo('');
  }

    const deleteToDo = (i) =>{ 

      if(window.confirm("Are you sure you want to delete this item?")){ 
        if(toDoArr.length>1){ 
          fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg',{
            method: "PUT",
            body: JSON.stringify(toDoArr.filter((item, index) => i!==index)),
            headers: {
              "Content-Type": "application/json"
            }
          })

          .then((response) => {
            if (!response.ok) {
              throw new Error('This is an HTTP error: The status is '+ response.status);
            }
            return response.json();
          })
          .then((actualData) => {  		
            setToDoArr(toDoArr.filter((item, index) => i!==index));	console.log("Borrando... "); console.log(actualData);            
            setError(null);
          })
          .catch((err) => {
            setError(err.message); setToDoArr([]);
          })
          .finally(() => {
            setLoading(false);
          });
        }else{
          deleteAll();
        }
    }
  }

  const deleteAll = () =>{ 

    if(window.confirm("Are you sure you want to delete the list?")){ 

      fetch('https://assets.breatheco.de/apis/fake/todos/user/danielacmg',{
        method: "DELETE"
      })

      .then((response) => {
        if (!response.ok) {
          throw new Error('This is an HTTP error: The status is '+ response.status);
        }
        return response.json();
      })
      .then((actualData) => {  		
        setToDoArr([]);	
        setError(null);
      })
      .catch((err) => {
        setError(err.message); setToDoArr([]);
      })
      .finally(() => {
        setLoading(false);
      });
    }
}

    useEffect(() => {
      fetchTodos();
    }, []); //toDoArr
  


  return (
    <div className="container-fluid bg-secondary p-2">
      <h1 className="text-center text-info">TO-DO's</h1>            
      {loading && <div className="spinner-border text-info" role="status">
                      <span className="visually-hidden">Loading...</span>
                  </div>}
        {error && (
          <div className="alert alert-danger" role="alert">
          {"There is a problem fetching the data " + "- "+ error}
        </div>
        )}
      <ul className="list-group list-group-flush text-light">
        <li className="list-group-item list-group-item-dark" >
          <div className="form">
            <div className="row">
              <div className="col">
                <input type="text" className="form-control-plaintext" onChange={e => setInputToDo(e.target.value)} value={inputToDo} placeholder="To do..." onKeyDown={e => ((e.key === 'Enter' && e.target.value !=="") ? addToDo(inputToDo): null) } autoFocus/>
              </div>							
            </div>
          </div>
        </li>
        {toDoArr.length ? toDoArr.filter(function (toDo) {
            return toDo.done==false;
          }).map((toDoItem, i) => (
          <li className="list-group-item list-group-item-action list-group-item-dark" key={i} onMouseOver={()=>showDelete(i)}  onMouseOut={()=>hideDelete(i)} >
            <div className="form">
              <div className="row">
                <div className="col">
                  <input type="text"  className="form-control-plaintext" value={toDoItem.label} />
                </div>
                <div className="col-1 d-none" id={i}>
                  <button className="btn btn-outline-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete To-do" onClick={()=>deleteToDo(i)}>X</button>
                </div>
                
              </div>
            </div>
          </li>
          )) : <p className="m-2">There's no tasks on the list, Let's add a task!</p>
          }
        
      </ul>
      {toDoArr.length>0 &&
      <div className="text-end mt-3 mb-3">
        <button className="btn btn-danger" type="button" data-toggle="tooltip" data-placement="top" title="Delete list" onClick={()=>deleteAll()}>Delete all</button>
      </div>}
    </div>
  )
}

export default ToDo
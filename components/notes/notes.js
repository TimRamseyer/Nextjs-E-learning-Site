import React, {useState, useEffect} from 'react'
import {API_URL} from '../../utils/urls'
import secondsToTimecode from '../../utils/secondsToTimecode'
import { BsCameraVideo } from "react-icons/bs"
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io"


/**
 * TODO 
 * pause video when add note button is pressed
 * find parameters that need to be saved to change to lesson that note is about when 
 * user clicks link
 * enable noted lesson to display when clicked
 * @param {*} props 
 * @returns 
 */
function Notes(props) {
    const [note, setNote] = useState("")
    const [noteToggle, setNoteToggle] = useState('hello')
    const [editNote, setEditNote] = useState('')
    const [noteId, setNoteId] = useState('')
    const [toggleEditButton, setToggleEditButton] = useState(true)
    
    
const placeHolder = 'Add a new note'
let writer = props.userId
let parentId = props.parentId
let time = props.time
let lessonId = props.activeLesson
let moduleId = props.moduleId
let course = props.courseModules
let lesson_name = props.title


useEffect(()=>{
setNoteToggle(moduleId)
},[])

useEffect(()=>{
  
    setNoteToggle(moduleId)
},[props.moduleId])

const handleChange = (e) =>{
setNote(e.currentTarget.value)
}

const handleEditChange = (e) =>{
    setEditNote(e.currentTarget.value)
}


const handleLessonUpdate =(note) =>{
    
    const filteredProps = props.courseModules.filter(x=>x.id == note.moduleId)
    const linkedModule = filteredProps[0].lesson
    const linkedLesson = linkedModule.filter(newLesson=>
        newLesson.id == note.lessonId
    )
    const lesson = linkedLesson[0]
    const time = note.time
    const final = [lesson, time, note.moduleId]
    props.refreshLessonFunction(final)
    
}

const deleteNote = async(noteId) =>{
    
    let currentNotesList = props.NoteLists

  let  req = await fetch(`${API_URL}/course-notes/${noteId}`, {method: 'DELETE'})
let res = await req.json()
const newNotesList = currentNotesList.filter(notesList=>notesList.id!= noteId)

props.refreshDeleteNote(newNotesList)
}


const onSubmit = async (e) =>{
e.preventDefault()
if(note){
 const res = await fetch(`${API_URL}/course-notes`, {
    method: 'POST',
    body: JSON.stringify({writer, parentId, note, lesson_name, time, moduleId, lessonId}),
    headers: {
        'Content-type': 'application/json',
        
    }
})
const req = await res.json() 

props.refreshFunction(req)
setNote('')
}
else return null
}

const onSubmitEdit = async (e) =>{
    e.preventDefault()
    
    if(editNote){
       
        const res = await fetch(`${API_URL}/course-notes/${noteId}`, {
            method: 'PUT',
            body: JSON.stringify({note: editNote}),
            headers: {
              
                'Content-type': 'application/json',
                
            }
            
        }) 
        const request = await fetch(`${API_URL}/course-notes?writer=${writer}&parentId=${parentId}`) 
        const response = await request.json()
       props.refreshEditFunction(response)  
    setEditNote('') 
    setNoteId('') 
    setToggleEditButton(true)
    }  

else return null
}

    return (
        <div>
            <br />
            <p>Notes</p>
            <hr />  
            {/* Comment List */}
            {course && course.map((module, index) =>{
                
                return(
                    <div key={index} style={{marginRight:'20%', marginLeft:'20%',paddingTop:'5px', borderBottom:'1px solid darkGrey'}}>
                <div key={index} style={{backgroundColor:'lightgray', paddingTop:'10px', paddingBottom:'10px'}}>
                <span style={{paddingLeft:'15px', fontWeight:'bold', margin:'auto'}}>
                    {module.title}
                    {noteToggle != module.id ? (
                        <button
                          style={{ color: "black", borderColor: "white" }}
                          onClick={() => {
                            setNoteToggle(module.id);
                          }}
                        >
                          <IoIosArrowDropdown style={{ fontSize: "24px" }} />
                        </button>
                      ) : (
                        <button
                          style={{ color: "black", borderColor: "white" }}
                          onClick={() => {
                            setNoteToggle("");
                          }}
                        >
                          <IoIosArrowDropup style={{ fontSize: "24px" }} />
                        </button>
                      )}
                </span>
                
                </div>
                
                {props.NoteLists && noteToggle == module.id && props.NoteLists.map((note, index) =>{
                    
                    return(
                        <div key={index}>
                        {note.moduleId==module.id &&
                        <>
                        <div>
                            
                        <a style={{display:'flex', color:'blue'}} onClick={()=>handleLessonUpdate(note)}><BsCameraVideo /> &nbsp; {note.lesson_name} {secondsToTimecode(note.time).substring(3,8)}</a>
                    </div>
                    {noteId == note.id?(<div>
                    <h2 >Edit your note</h2>
                    {/*getNoteId(note.id)*/}
                    <form onSubmit={onSubmitEdit}>
                        <textarea
                        style={{ width: '100%',height:'100px', borderRadius: '5px' , border: '1px solid #333', marginTop:'10px',marginRight:'0%', overflowY:"scroll"}}
                        onChange={handleEditChange}
                        //value={editNote}
                        defaultValue={note.note}
                        placeholder= {`${placeHolder}`}
                        />
                        <br />
                        <div style={{display:'flex',justifyContent:'center'}}>
                        <button onClick={()=>setNoteId('') } style={{ width: '20%', height: '52px', border: '1px solid #333' }}>Cancel</button>
                        <button onClick={()=>{setNoteId(note.id)}} style={{ width: '20%', height: '52px', border: '1px solid #333', marginLeft:'1%' }}>Submit</button>
                        </div>
                    </form>
                </div>):(<p>{note.note}</p>
                        
                    )}
                        
                        <div style={{textAlign:'right', paddingRight:'20px'}}> 
                        {toggleEditButton?
                            <span><a onClick={()=> {setNoteId(note.id), setToggleEditButton(false)}}>Edit</a>
                           &nbsp;|  <a onClick={() => {
                                
                               
                                let check = confirm("This will delete the current note. \nDo you wish to proceed?")
                                if (check){
                                    
                                    deleteNote(note.id)
                                }
                        
                        }}>Delete</a></span>
                        : 
                        <span>
                        <a onClick={() => {
                                
                               
                            let check = confirm("This will delete the current note. \nDo you wish to proceed?")
                            if (check){
                                
                                deleteNote(note.id)
                            }
                    
                    }}>Delete</a></span>
                        }  
                            
    </div>
    <hr  style={{borderTopColor:'darkGrey'}}/>
                        </>
                        }
                        </div>
                    )
                }) }
            </div>)
            })}

            {/* Root Comment Form */}
            <h2 style={{marginLeft:'20%', marginTop:'10px'}}>Add new note</h2>
            <form style={{ display:'flex' }} onSubmit={onSubmit}>
                <textarea
                style={{ width: '100%',height:'100px', borderRadius: '5px' , border: '1px solid #333', marginTop:'10px',marginRight:'0%', marginLeft:'20%', overflowY:"scroll"}}
                onChange={handleChange}
                value={note}
                placeholder= {`${placeHolder}`}
                />
                <br />
                <button style={{ width: '20%', height: '52px', border: '1px solid #333', marginTop:'auto', marginRight:'7%', marginLeft:'1%' }}>Submit</button>
            </form>
        </div>
    )
}

export default Notes
import Link from "next/link";
import React, { useState, createRef, useEffect, useContext, useCallback} from "react";
import Image from "next/image"
import ReactPlayer from "react-player";
import { useSession } from 'next-auth/client'
import parse from "html-react-parser";
import cookie from 'js-cookie'
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";
import Transcription from '../components/eLearning/transcription'
import { Container } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { API_URL } from '../utils/urls'
import { CircularProgressbarWithChildren } from "react-circular-progressbar";
import { fetchAPI } from '../utils/urls'
//import 'styles/CardSectionStyles.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import "react-circular-progressbar/dist/styles.css";
import Comments from '../components/comments/comment'
import Notes from '../components/notes/notes'
import {
  MdSchool,
  MdDescription,
  MdForum,
  MdCheckBoxOutlineBlank,
  MdCheckBox,
} from "react-icons/md";
import { BsPencilSquare, BsLayoutTextSidebarReverse } from "react-icons/bs";
import { BiTime } from "react-icons/bi";
import { IoIosArrowDropdown, IoIosArrowDropup } from "react-icons/io";

const Course = ({ course, categories, global }) => {
  const [ session, loading ] = useSession()
  const ref = createRef();
  const [playing, setPlaying] = useState(false)
  const [VIDEO_URL, setVIDEO_URL] = useState('')
  const [POSTER_URL, setPOSTER_URL] = useState('')
  const [addNote, setAddNote] = useState(0);
  const [value, setValue] = useState(0);
  const [overview, setOverview] = useState('')
  const [activeLesson, setActiveLesson] = useState()
  const [activeTitle, setActiveTitle] = useState()
  const [dropDown, setDropDown] = useState('');
const [fileName, setFileName] = useState('')
const [currentTime, setCurrentTime] = useState(0)
const [sttJsonType, setJsonType] = useState('bbckaldi') // TODO import from database
const [handleAnalyticsEvents, setHandleAnalyticsEvents] = useState()
const [TRANSCRIPT, SetTRANSCRIPT] = useState()
const [transcriptURL, setTranscriptURL] = useState()
const [processing, setProcessing] = useState(false)
const [CommentLists, setCommentLists] = useState([])
const [NoteLists, setNoteLists] = useState([])
const [user, setUser] = useState([])
const [courseModules, setCourseModules] = useState([])
const [resourceToggle, setResourceToggle] = useState('')
const isScrollIntoViewOn = false
const timecodeOffset = 0
const videoRef = createRef()
const timedTextEditorRef = createRef()
const userId = cookie.get('user')
const courseId = course.id


  const [courseProgress, setCourseProgress] = useState(course.course_progresses)
 const  [userProgress, setUserProgress] = useState(courseProgress.filter(x => x.completed == true && x.user == userId))

const userCompleted = userProgress.length

const [lessonsCompleted, setLessonsCompleted] = useState(userCompleted)
console.log("The course props", course)
/**
 * Check window size and conditionally display or hide elements
 * @param {*} width 
 * @returns 
 * TODO place in helper functions file
 */
const useMediaQuery = (width) => {
  const [targetReached, setTargetReached] = useState(false);

  const updateTarget = useCallback((e) => {
    if (e.matches) {
      setTargetReached(true);
    } else {
      setTargetReached(false);
    }
  }, []);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${width}px)`)
    media.addEventListener('change', e => updateTarget(e))

    // Check on mount (callback is not called until a change occurs)
    if (media.matches) {
      setTargetReached(true)
    }

    return () => media.removeEventListener('change', e => updateTarget(e))
  }, [])

  return targetReached;
};

const isBreakpoint = useMediaQuery(768)


  let modules = course.modules;
  const courseLessons = modules.reduce((total, amount) => {
  
    amount.lesson.forEach( color => {
        total.push(color);
    })
    return total;
  }, [])
  const lessonLength = courseLessons.length
console.log("Lesson count var",courseLessons)

const updateComment = (newComment) =>{
  setCommentLists(CommentLists.concat(newComment))
}

const UpdateNote = (newNote) =>{
  setNoteLists(NoteLists.concat(newNote))
}
const UpdateDeleteNote = (removeNote) => {
  setNoteLists(removeNote)
}

const UpdateEditNote = (editNote) =>{
  setNoteLists(editNote)
}

const UpdateLessonNote = (lessonNote) =>{
console.log("I'm the UpdateLessonNote function", lessonNote)
    setPOSTER_URL(lessonNote[0].video.poster.url);
    setVIDEO_URL(lessonNote[0].video.video.url);
    lessonNote[0].overview && setOverview(lessonNote[0].overview);
    setActiveLesson(lessonNote[0]._id);
    setActiveTitle(lessonNote[0].title)
    videoRef.current.seekTo(lessonNote[1])
    setDropDown(lessonNote[2])
}


const fetchUser = async () =>{
  const response = await fetch(`${API_URL}/users/${userId}`)
  const json = await response.json()
  setUser(json)
}
const fetchTransciption = async () => {
  const response = await fetch(`${API_URL}${transcriptURL}`)
  const json = await response.json()
SetTRANSCRIPT(json)
}

const fetchComments = async () => {
  const response = await fetch(`${API_URL}/comments?parentId=${course.id}`)
  const json = await response.json()
  setCommentLists(json)
}

const fetchNotes = async () => {
  const response = await fetch(`${API_URL}/course-notes?parentId=${course.id}&writer=${userId}`)
  const json = await response.json()
  setNoteLists(json)
}
  /**
   * 
   * 
   * Set intial course settings on page load if user has no cookies from previous visit
   * 
   */
  
  if (!VIDEO_URL){
    const initalVideo = course.modules[0].lesson[0].video.video.url
    setVIDEO_URL(initalVideo)
  }
  if (!POSTER_URL){
    const initalPoster = course.modules[0].lesson[0].video.poster.url
    setPOSTER_URL(initalPoster)
  }
  if (!activeLesson){
    const initalLesson = course.modules[0].lesson[0].id
    setActiveLesson(initalLesson)
  }
  if (!activeTitle){
    const initalTitle = course.modules[0].lesson[0].title
    setActiveTitle(initalTitle)
  }
  if (!overview){
    const initialOverview = course.modules[0].lesson[0].overview
    setOverview(initialOverview)
  }
if(!transcriptURL){
  const transcriptPath = course.modules[0].lesson[0].transcription.url
  setTranscriptURL(transcriptPath)
}
/*if(!dropDown){
  const moduleID = course.modules[0]._id
  setDropDown(moduleID)
}*/

  
const updateWatched = async (progressID) =>{
  const res = await fetch(`${API_URL}/course-progresses/${progressID}`, {
    method: 'PUT',
    body: JSON.stringify({completed: true}),
    headers: {
      'Authorization': `Bearer ${session.jwt}`,
        'Content-type': 'application/json',
        
    }
    
}) 
const request = await fetch(`${API_URL}/course-progresses?user=${userId}&completed=true&course=${course.id}`) 
const response = await request.json()
const resLength = response.length
let progress = (resLength/lessonLength * 100)
  const pecentageRounded = Math.round(progress)
  setValue(pecentageRounded)
  setCourseProgress(response)
setProcessing(false)
}

const createWatched = async () => {
  const res = await fetch(`${API_URL}/course-progresses`, {
    method: 'POST',
    body: JSON.stringify({completed: true, course: course.id, lesson_id : activeLesson, user : userId, users_permissions_user : userId}),
    headers: {
      'Authorization': `Bearer ${session.jwt}`,
        'Content-type': 'application/json',
        
    }
    
}) 
const request = await fetch(`${API_URL}/course-progresses?user=${userId}&completed=true&course=${course.id}`) 
const response = await request.json()
const resLength = response.length
let progress = (resLength/lessonLength * 100)
  const pecentageRounded = Math.round(progress)
  setValue(pecentageRounded)
  setCourseProgress(response)
  setProcessing(false)
}

  const handleWatchComplete = ({ played }) => {
  
    if (played >= 0.8 && !processing) {
     
    
    const watched = courseProgress.filter(x => x.lesson_id == activeLesson && x.completed == true && x.user == userId)
     
     const notWatched = courseProgress.filter(x => x.completed == false && x.user == userId && x.lesson_id == activeLesson)
      
      if(watched && watched[0] && watched[0].lesson_id == activeLesson){
        return null
      }
       if (notWatched && notWatched[0] && notWatched[0].lesson_id == activeLesson){
        const progressID = notWatched[0].id
        setProcessing(true)
        updateWatched(progressID)
      } else {
        setProcessing(true)
        createWatched()
        
      }
      
      
    }
  };

  const seek = () => {
    ref.current.seekTo(addNote);
  };
  const setTime = () => {
    let time = ref.current.getCurrentTime();
    
  };

  const addNoteFunction = () => {
    setPlaying(false);
    let time = ref.current.getCurrentTime();
    setAddNote(time);
    
  };

  /**
   * 
   * User Course progress from cookies
   */

   if(!cookie.get(`${course._id}CV`)){
    cookie.set(`${course._id}CV`, VIDEO_URL, {expires: 180, secure:false}) // set to true in production
    cookie.set(`${course._id}CP`, POSTER_URL, {expires: 180, secure:false})
    cookie.set(`${course._id}AL`, activeLesson, {expires: 180, secure:false})
    cookie.set(`${course._id}AT`, activeTitle, {expires: 180, secure:false})
    cookie.set(`${course._id}OV`, overview, {expires: 180, secure:false})
    cookie.set(`${course._id}TURL`, transcriptURL, {expires: 180, secure:false})
  } 
useEffect(()=>{
  fetchUser()
  setLessonsCompleted(userCompleted)
  fetchTransciption()
  fetchComments()
  fetchNotes()
  setCourseModules(modules)
  if(!dropDown){
    const moduleID = course.modules[0]._id
    setDropDown(moduleID)}
  if(cookie.get(`${course._id}CV`)){
    let progress = cookie.get(`${course._id}CV`) 
    setVIDEO_URL(progress)
    if(cookie.get(`${course._id}CP`)){
      let poster = cookie.get(`${course._id}CP`)
      setPOSTER_URL(poster)
    }
    if(cookie.get(`${course._id}AL`)){
      let lesson = cookie.get(`${course._id}AL`)
      setActiveLesson(lesson)
    }
    if(cookie.get(`${course._id}AT`)){
      let lesson = cookie.get(`${course._id}AT`)
      setActiveTitle(lesson)
    }
    if(cookie.get(`${course._id}OV`)){
      let overview = cookie.get(`${course._id}OV`)
      setOverview(overview)
    }
    if(cookie.get(`${course._id}TAB`)){
      let dropdown = cookie.get(`${course._id}TAB`)
      setDropDown(dropdown)
    }
    if(cookie.get(`${course._id}TURL`)){
      let url = cookie.get(`${course._id}TURL`)
      setTranscriptURL(url)
    }
  }
},[]);

useEffect(()=>{
  if(cookie.get(`${course._id}CV`) != VIDEO_URL){
    cookie.set(`${course._id}CV`, VIDEO_URL)
    if(cookie.get(`${course._id}CP`) != POSTER_URL){
      cookie.set(`${course._id}CP`, POSTER_URL)
    }
    if(cookie.get(`${course._id}AL`) != activeLesson){
      cookie.set(`${course._id}AL`, activeLesson)
    }
    if(cookie.get(`${course._id}AT`) != activeTitle){
      cookie.set(`${course._id}AT`, activeTitle)
    }
    if(cookie.get(`${course._id}OV`) != overview){
      cookie.set(`${course._id}OV`, overview)
    }
    if(cookie.get(`${course._id}TURL`) != transcriptURL){
      cookie.set(`${course._id}TURL`, transcriptURL)
    }
    if(cookie.get(`${course._id}TAB`) != dropDown){
      cookie.set(`${course._id}TAB`, dropDown)
    }
  }
},[VIDEO_URL]);
 
useEffect(()=>{
  let progress = (lessonsCompleted/lessonLength * 100)
  const pecentageRounded = Math.round(progress)
  setValue(pecentageRounded)
  if (pecentageRounded == 100){
    console.log("Course Completed")
  }
},[lessonsCompleted, userProgress])
  /**
 * 
 *  Transcription & React Video Player Functions
 */
const handleTimeUpdate = (e) => {
  const currentTime = e.target.currentTime;
    setCurrentTime(currentTime)
}



const handleWordClick = (startTime) => {
  if (handleAnalyticsEvents) {
    setHandleAnalyticsEvents({
      category: 'TranscriptEditor',
      action: 'doubleClickOnWord',
      name: 'startTime',
      value: secondsToTimecode(startTime)
    });
  }
   
      videoRef.current.seekTo(startTime);
};

const handlePlayMedia = (isPlaying) => {
  playMedia(isPlaying);
};

const handleIsPlaying = () => {
  return isPlaying();
};

if (loading) return (
  <div >
  <ClipLoader color="blue" loading={loading}  size={150} />
  </div>
)

//if (!loading && !session) return <p>You Must be logged in to view this course</p>

if (!loading)
  return (
    <>
      {/*<Layout categories={categories}> */}
      {/* <Seo metadata={metadata} /> */}
      
      <main style={{width:"100%"}}>
        <div style={{ backgroundColor: "rgba(49, 130, 206)", color: "white", display:"flex"}}>
          <Col>
            <Link href="/">
              <a>
                <Image
                  src='/vercel.svg'
                  width={60}
                  height={60}
                  alt="logo"
                />
              </a>
            </Link>
          </Col>
          <Col>
            <h1
              style={{
                color: "white",
                fontSize: 20,
                textAlign: "center",
                padding: "22px 0px",
              }}
            >
              {course.name}
            </h1>
          </Col>
          <Col>
            <div style={{ width: 60, height: 60 }}>
              <CircularProgressbarWithChildren value={value}>
                <MdSchool size={40} style={{ marginTop: -3, color: "white" }} />
                <div style={{ fontSize: 12, marginTop: -7 }}>
                  <strong>{value}%</strong>
                </div>
              </CircularProgressbarWithChildren>
            </div>
          </Col>
        </div>
        <div style={{display:"flex"}}>
          <Col>
            <div>
              <ReactPlayer
                ref={videoRef}
                onTimeUpdate = { handleTimeUpdate }
                config={{
                  file: {
                    attributes: {
                      controlsList: "nodownload",
                      poster: `${API_URL + POSTER_URL}`,
                    },
                  },
                }}
                url={API_URL + VIDEO_URL}
                width="100%"
                height="100%"
                className="player"
                poster={API_URL + POSTER_URL }
                controls
                onProgress={handleWatchComplete}
              />
            </div>
           {/* <Row>
              <Button onClick={seek}>Bookmark</Button>
              <Button onClick={addNoteFunction}>Add Note</Button>
           </Row> */}
            <div>
{/** TODO Needs to be placed in a component for readability i.e mobile tab and desktop tab */}
             {isBreakpoint?(
              <STabs
                selectedTabClassName="is-selected"
                selectedTabPanelClassName="is-selected" 
              >
              
                <STabList>
                  
                <STab>
                    <div className="d-flex d-md-none" style={{ alignItems: "center" }}>
                      <MdDescription />
                      &nbsp;Content
                    </div>
                  </STab>
                  
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MdDescription />
                      &nbsp;Overview
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MdForum />
                      &nbsp;Q&amp;A
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsPencilSquare />
                      &nbsp;Notes
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsLayoutTextSidebarReverse />
                      &nbsp;Transcript
                    </div>
                  </STab>
                </STabList>
                <STabPanel className="d-md-none">
            <div
              style={{
                padding: "5px",
                borderBottom: " 1px solid #D3D3D3",
              }}
            >
              <h2
                style={{
                  color: "black",
                  padding: "16px 48px 16px 8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Course Content
              </h2>
            </div>
            <ul className="nav flex-column">
              {modules.map((module) => {
                console.log("The modules as they are mapped", module)
                return (
                  <li className="nav-item" style={{borderBottom:"1px solid #D3D3D3"}} key={module._id}>
                    <h2
                      style={{
                        color: "black",
                        fontWeight: "Bold",
                        fontSize: "14px",
                        padding: "16px 48px 16px 14px",
                        borderBottom: "black",
                      }}
                    >
                      {module.title}

                      {dropDown != module._id ? (
                        <button
                          style={{ color: "black", borderColor: "white" }}
                          onClick={() => {
                            setDropDown(module._id);
                          }}
                        >
                          <IoIosArrowDropdown style={{ fontSize: "24px" }} />
                        </button>
                      ) : (
                        <button
                          style={{ color: "black", borderColor: "white" }}
                          onClick={() => {
                            setDropDown("");
                          }}
                        >
                          <IoIosArrowDropup style={{ fontSize: "24px" }} />
                        </button>
                      )}
                    </h2>

                    {module.lesson.map((lesson) => { 
                      return (
                        <ul
                          key={lesson._id}
                          className={`flex-colunm menuMobile-item ${
                            activeLesson == lesson._id && "activeMobile"
                          }`}
                        >
                          <a
                            className={`nav-link mr-auto ml-auto pl-auto pr-auto ${
                              dropDown != module._id && "courseMenuToggle"
                            }`}
                            style={{ fontSize: "14px" }}
                            onClick={() => {
                              setPOSTER_URL(lesson.video.poster.url);
                              setVIDEO_URL(lesson.video.video.url);
                              lesson.overview && setOverview(lesson.overview);
                              setActiveLesson(lesson._id);
                              setActiveTitle(lesson.title)
                             
                            }}
                          >
                            <p style={{ display: "flex" }}>
                              {courseProgress.filter(x => x.lesson_id == lesson.id && x.completed == true && x.user == userId ).length == 1
                              ? <MdCheckBox />
                             : <MdCheckBoxOutlineBlank />}
                              &nbsp;{lesson.title}
                            </p>
                            <p
                              className="nav-link"
                              style={{
                                fontSize: "12px",
                                padding: "0rem 1rem",
                                display: "flex",
                              }}
                            >
                              <BiTime />
                              &nbsp;{lesson.video.duration}
                            </p>
                          </a>
                        </ul>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
           


                </STabPanel>
                <STabPanel>{parse(overview)}</STabPanel>
                <STabPanel>
               <Comments CommentLists={CommentLists} userId={`${userId}`} parentId={`${courseId}`} writerDetails={user} refreshFunction={updateComment}/>
                </STabPanel>
                <STabPanel>
                  <Notes NoteLists={NoteLists} userId = {`${userId}`} parentId={`${courseId}`} activeLesson={activeLesson} moduleId={dropDown} time ={`${currentTime}`} title={activeTitle} courseModules={courseModules} refreshDeleteNote={UpdateDeleteNote} refreshFunction={UpdateNote} refreshEditFunction={UpdateEditNote}/>
                </STabPanel>
                <STabPanel>
                <Transcription
        fileName={ fileName }
        transcriptData={ TRANSCRIPT }
        timecodeOffset={ timecodeOffset }
        onWordClick={ handleWordClick }
        playMedia={ handlePlayMedia }
        isPlaying={ handleIsPlaying }
        currentTime={ currentTime }
        sttJsonType={ sttJsonType }
        //mediaUrl={ mediaUrl }
        isScrollIntoViewOn={ isScrollIntoViewOn }
        //isPauseWhileTypingOn={ this.state.isPauseWhileTypingOn }
        ref={ timedTextEditorRef }
        handleAnalyticsEvents={ handleAnalyticsEvents }
        //handleAutoSaveChanges={ this.handleAutoSaveChanges }
        //title={ title }
/>
                </STabPanel>
              </STabs>):(
                <STabs
                selectedTabClassName="is-selected"
                selectedTabPanelClassName="is-selected" 
              >
              
                <STabList>
                  
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MdDescription />
                      &nbsp;Overview
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <MdForum />
                      &nbsp;Q&amp;A
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsPencilSquare />
                      &nbsp;Notes
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsLayoutTextSidebarReverse />
                      &nbsp;Transcript
                    </div>
                  </STab>
                  <STab>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <BsLayoutTextSidebarReverse />
                      &nbsp;Resources
                    </div>
                  </STab>
                </STabList>
                <STabPanel>{parse(overview)}</STabPanel>
                <STabPanel>
               <Comments CommentLists={CommentLists} userId={`${userId}`} parentId={`${courseId}`} writerDetails={user} refreshFunction={updateComment}/>
                </STabPanel>
                <STabPanel>
                  <Notes NoteLists={NoteLists} userId = {`${userId}`} parentId={`${courseId}`} time ={`${currentTime}`} moduleId={dropDown} activeLesson={activeLesson} title={activeTitle} courseModules={courseModules} refreshDeleteNote={UpdateDeleteNote} refreshFunction={UpdateNote} refreshEditFunction={UpdateEditNote} refreshLessonFunction={UpdateLessonNote}/>
                </STabPanel>
                <STabPanel>
                <Transcription
        fileName={ fileName }
        transcriptData={ TRANSCRIPT }
        timecodeOffset={ timecodeOffset }
        onWordClick={ handleWordClick }
        playMedia={ handlePlayMedia }
        isPlaying={ handleIsPlaying }
        currentTime={ currentTime }
        sttJsonType={ sttJsonType }
        //mediaUrl={ mediaUrl }
        isScrollIntoViewOn={ isScrollIntoViewOn }
        //isPauseWhileTypingOn={ this.state.isPauseWhileTypingOn }
        ref={ timedTextEditorRef }
        handleAnalyticsEvents={ handleAnalyticsEvents }
        //handleAutoSaveChanges={ this.handleAutoSaveChanges }
        //title={ title }
/>
                </STabPanel>
                <STabPanel>
                  <div>
                    <div>
                    <h2>Course Resources</h2>
                    </div>
                    <div>
                      {courseLessons.map((lesson, index) => {

                        return(
                        <div key={index} style={{marginRight:'20%', marginLeft:'20%',paddingTop:'5px', borderBottom:'1px solid darkGrey'}}>
                        <div key={index} style={{backgroundColor:'lightgray', paddingTop:'10px', paddingBottom:'10px'}}>
                        <div style={{paddingLeft:'15px', fontWeight:'bold', margin:'auto'}}>
                        {lesson.title}
                        <div className="numberCircle">{lesson.resources.length}</div>
                        {resourceToggle != lesson.id ? (
                        <button
                          style={{ color: "black", borderColor: "white", marginLeft:'auto', marginRight:'5px' }}
                          onClick={() => {
                            setResourceToggle(lesson.id);
                            console.log("Lesson Id", lesson.id)
                          }}
                        >
                          <IoIosArrowDropdown style={{ fontSize: "24px"}} />
                        </button>
                      ) : (
                        <button
                          style={{ color: "black", borderColor: "white", marginLeft:'auto', marginRight:'5px' }}
                          onClick={() => {
                            setResourceToggle("");
                          }}
                        >
                          <IoIosArrowDropup style={{ fontSize: "24px" }} />
                        </button>
                      )}
                        
                        </div>
                      </div>
                      {resourceToggle==lesson.id && lesson.resources.length >=1 &&( 
                      <div>
                      <ul className="cards" style={{justifyContent:"center"}}>
                      {lesson.resources.map((resource, index) =>{
                        
                          let ext = resource.ext
                          let name = resource.name
                          let extName;
                          
                          
        if (ext === ".pdf") {
          extName = "pdf";
        } else if (ext === ".zip") {
          extName = "zip";
        } else if (ext === ".doc" || ext === ".docx" || ext === ".docm") {
          extName = "doc";
        } else if (ext === ".xls" || ext === ".xlsm" || ext === ".xlsx") {
          extName = "xls";
        } else if (ext === ".jpg" || ext === ".jpeg") {
          extName = "jpeg";
        } else if (ext === ".gif") {
          extName = "gif";
        } else {
          extName = "file";
        }
        let image = "/icons/" + `${extName}` + ".svg";

                        
                        return(
                    <>
 <li className="cards_item">
 <div className="card">
   
   <div className="card_content">
     <h2 className="card_title">{resource.caption}</h2>
     <div className="card_image">
     <Image
                      src={`${image}`}
                      alt={`${name}`}
                      width={60}
                      height={80}
                    />
       </div>
     <p className="card_text">{resource.name}</p>
     {/*<button class="btn card_btn">Download</button>*/}
   </div>
 </div>

</li> 
                      </>
                      )})}
                      </ul>
                      </div>
                    )}

{resourceToggle==lesson.id && !lesson.resources.length && ( 
  <div key={index}>
<p>There are no resources for this lesson</p>
</div>
)}

                  </div>)
                      })}
                      </div>
                      </div>
                </STabPanel>
              </STabs>
              )}
            </div>
          </Col>
          {/** TODO Move to component for readabily */}
{!isBreakpoint?(<Col
            /*className="d-none d-md-block"*/
            style={{
              backgroundColor: "#3a3a3a",
              padding: "inherit",
              color: "white",
              flex: "0 0 20%",
              maxWidth: "20%",
            }}
          >
            <div
              style={{
                padding: "5px",
                borderBottom: " 1px solid rgba(255,255,255,.35)",
              }}
            >
              <h2
                style={{
                  color: "white",
                  padding: "16px 48px 16px 8px",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Course Content
              </h2>
            </div>
            <ul className="nav flex-column">
              {modules.map((module) => {
                return (
                  <li className="nav-item" key={module._id}>
                    <h2
                      style={{
                        color: "white",
                        fontWeight: "Bold",
                        fontSize: "14px",
                        padding: "16px 48px 16px 14px",
                        borderBottom: "1px solid rgba(255,255,255,.35)",
                      }}
                    >
                      {module.title}
                      {dropDown != module._id ? (
                        <button
                          style={{ color: "white", borderColor: "white" }}
                          onClick={() => {
                            setDropDown(module._id);
                            cookie.set(`${course._id}TAB`, module._id, {expires: 180, secure:false})
                          }}
                        >
                          <IoIosArrowDropdown style={{ fontSize: "24px" }} />
                        </button>
                      ) : (
                        <button
                          style={{ color: "white", borderColor: "white" }}
                          onClick={() => {
                            setDropDown("");
                          }}
                        >
                          <IoIosArrowDropup style={{ fontSize: "24px" }} />
                        </button>
                      )}
                    </h2>

                    {module.lesson.map((lesson) => {
                      
                      return (
                        <ul
                          key={lesson._id}
                          className={`flex-colunm menu-item ${
                            activeLesson == lesson._id && "active"
                          }`}
                        >
                          <a
                            className={`nav-link ${
                              dropDown != module._id && "courseMenuToggle"
                            }`}
                            style={{ fontSize: "14px" }}
                            onClick={() => {
                              setPOSTER_URL(lesson.video.poster.url);
                              setVIDEO_URL(lesson.video.video.url);
                              lesson.overview && setOverview(lesson.overview);
                              setActiveLesson(lesson._id);
                              setActiveTitle(lesson.title)
                            }}
                          >
                            <p style={{ display: "flex" }}>
                            {courseProgress.filter(x => x.lesson_id == lesson.id && x.completed == true && x.user == userId ).length == 1
                              ? <MdCheckBox />
                             :
                              <MdCheckBoxOutlineBlank />}
                              &nbsp;{lesson.title}
                            </p>
                            <p
                              className="nav-link"
                              style={{
                                fontSize: "12px",
                                padding: "0rem 1rem",
                                display: "flex",
                              }}
                            >
                              <BiTime />
                              &nbsp;{lesson.video.duration}
                            </p>
                          </a>
           
                        </ul>
                      );
                    })}
                  </li>
                );
              })}
            </ul>
          </Col>):
          null}
          
        </div>
      </main>
    </>
  );
};
/**
 * Allows dynamic SSR when used in [slug].js
 * @param {*} param0 
 * @returns 
 */
/*export async function getStaticPaths() {
  const courses = await fetchAPI("/courses");
  
  return {
    paths: courses.map((course) => ({
      params: {
        slug: course.slug,
      },
    })),
    fallback: false,
  };
}*/

export async function getStaticProps({ params }) {
  const courses = await fetchAPI(
   // `/courses?slug=${params.slug}&status=published`
   `/courses?slug=course-one&status=published`

  );
 
  const categories = await fetchAPI("/categories");

  return {
    props: { course: courses[0], categories },
    revalidate: 1,
  };
} 

const STabs = styled(Tabs)`
  font-family: inherit;
  font-size: 14px;
  width: 100%;
`;
const STabList = styled(TabList)`
  list-style-type: none;
  padding: 4px;
  width: 100%;
  display: flex;
  margin: 0;
  justify-content: space-evenly;
`;
STabList.tabsRole = "TabList";
const STab = styled(Tab)`
  margin-right: 4px;
  border: none;
  padding: 4px;
  user-select: none;
  cursor: arrow;
  font-size: 14px;
  &.is-selected {
    color: rgba(49, 130, 206);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(0, 0, 255, 0.5);
  }
`;
STab.tabsRole = "Tab";
const STabPanel = styled(TabPanel)`
  display: none;
  min-height: 40vh;
  width: 100%;
  border: 0px solid black;
  padding: 4px;
  margin-top: -5px;

  &.is-selected {
    display: block;
  }
`;
STabPanel.tabsRole = "TabPanel";

export default Course;

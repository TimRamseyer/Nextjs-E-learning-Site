import React, {useState} from 'react'
import {API_URL} from '../../utils/urls'
import SingleComment from './singleComment'
import ReplyComment from './replyComment'
//import {Button , Input} from 'antd'

//const { TextArea } = Input

function Comments(props) {
    const [comment, setComment] = useState("")
const placeHolder = 'Ask a Question'
console.log("Writer Details", props.writerDetails)
let writer = props.userId
let writer_username = props.writerDetails.username
let writer_avatar
if(props.writerDetails.avatar){ writer_avatar = props.writerDetails.avatar.url}
else writer_avatar = `/uploads/default-user-image.png`
let parentId = props.parentId
let content = comment
//let collection_type = 'course'
console.log("The Props",props)
const handleChange = (e) =>{
setComment(e.currentTarget.value)
}

const onSubmit = async (e) =>{
e.preventDefault()
if(comment){
 const res = await fetch(`${API_URL}/comments`, {
    method: 'POST',
    body: JSON.stringify({writer, parentId, content, writer_username, writer_avatar}),
    headers: {
        'Content-type': 'application/json',
        
    }
})
const req = await res.json() 
console.log("The response from the onSubmit function", req)
setComment('')
props.refreshFunction(req)
}
else return null
}

    return (
        <div>
            <br />
            <h1>Questions &amp; Answers</h1>
            <p>Ask a question here</p>
            <hr />  
            {/* Comment List */}
            {console.log(props.CommentLists)}
            {props.CommentLists && props.CommentLists.map((comment, index) =>{

                if(!comment.responseTo){
                return(
                <>
                <SingleComment comment={comment} parentId={parentId} writer={writer} writer_username={comment.writer_username} writer_avatar={comment.writer_avatar} refreshFunction={props.refreshFunction} />
                <ReplyComment CommentLists={props.CommentLists} parentId={parentId} writer_username={writer_username} writer_avatar={writer_avatar} parentCommentId={comment._id} refreshFunction={props.refreshFunction} />
                </>)
                }
            })}
            {/* Root Comment Form */}
            <form style={{ display:'flex' }} onSubmit={onSubmit}>
                <textarea
                style={{ width: '100%', borderRadius: '5px' , border: '1px solid #333', marginTop:'10px'}}
                onChange={handleChange}
                value={comment}
                placeholder= {`${placeHolder}`}
                />
                <br />
                <button style={{ width: '20%', height: '52px', border: '1px solid #333', marginTop:'10px' }}>Submit</button>
            </form>
        </div>
    )
}

export default Comments
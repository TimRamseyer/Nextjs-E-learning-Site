import React, {useState} from 'react'
import {Comment, Avatar} from 'antd'
import {API_URL} from '../../utils/urls'

function SingleComment(props) {
console.log("comments from props", props)
console.log("The single component has been called")
    const [CommentValue, setCommentValue] = useState("")
    const [OpenReply, setOpenReply] = useState(false)
    let writer_username = props.writer_username
    let writer_avatar = props.writer_avatar
    const handleChange = (e) => {
        setCommentValue(e.currentTarget.value)
    }

    const openReply = () => {
        setOpenReply(!OpenReply)
    }

    const placeHolder = 'Type your reply...'
    const onSubmit = async (e) =>{
        e.preventDefault()
        let writer = props.writer
        
        let parentId = props.parentId
        let responseTo = props.comment._id
        let content = CommentValue
        if(CommentValue){
         const res = await fetch(`${API_URL}/comments`, {
            method: 'POST',
            body: JSON.stringify({writer, parentId, content, responseTo, writer_username, writer_avatar}),
            headers: {
                'Content-type': 'application/json',
                
            }
        })
        const req = await res.json() 
console.log("The response from the onSubmit function", req)
setCommentValue('')
setOpenReply(false)
props.refreshFunction(req)
}
else return null
}
    const action = [
<span style={{color:'darkgrey'}} onClick={openReply} key="comment-basic-reply-to">Reply to</span>
    ]

    return (
    <div>
    <Comment
    actions={action}
    author = {writer_username}
    avatar={<Avatar src={`${API_URL}${writer_avatar}`} alt= 'User Avatar' />}
    content={
            <p>
{props.comment.content}
            </p>
        }
    ></Comment>
    {OpenReply &&
<form style={{ display:'flex' }} onSubmit={onSubmit}>
                <textarea
                style={{ width: '100%', borderRadius: '5px' , border: '1px solid #333', marginTop:'10px'}}
                onChange={handleChange}
                value={CommentValue}
                placeholder= {`${placeHolder}`}
                />
                <br />
                <button style={{ width: '20%', height: '52px', border: '1px solid #333', marginTop:'10px' }} onClick={onSubmit}>Submit</button>
            </form>
}
    </div>
    )
}

export default SingleComment
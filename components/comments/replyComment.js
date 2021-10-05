import React ,{useState, useEffect} from 'react'
import SingleComment from './singleComment'

function ReplyComment(props){
console.log("Props in the replyComment", props)
    const [ChildCommentNumber, setChildCommentNumber] = useState(0)
    const [OpenReplyComments, setOpenReplyComments] = useState(false)
    useEffect(() => {

        let commentNumber = 0;
        props.CommentLists.map((comment) => {

            if (comment.responseTo === props.parentCommentId) {
                commentNumber++
            }
        })
        setChildCommentNumber(commentNumber)
    }, [props.CommentLists, props.parentCommentId])

    

let renderReplyComment = (parentCommentId) =>{
    return (
        <>
    {props.CommentLists && props.CommentLists.map((comment, index) =>{
        console.log("CommentList in the renderReply", comment )
        return (<>
        {comment.responseTo == parentCommentId &&
        <div key={{index}} style={{ marginLeft: '50px', width: '80%'}}>
    <SingleComment comment={comment} parentId={props.parentId} writer={props.writer} writer_username={comment.writer_username} writer_avatar={comment.writer_avatar} refreshFunction={props.refreshFunction} />
    <ReplyComment CommentLists={props.CommentLists} parentId={props.parentId} refreshFunction={props.refreshFunction} parentCommentId={comment._id}/>
    </div> 
    }
         </>)
        
       
})
 } </>)
}

const handleChange = () => {
    setOpenReplyComments(!OpenReplyComments)
}

    return (
        <>
        <div>
            {ChildCommentNumber >0 &&
            <p style={{ fontSize: '14px', margin: 0, color: 'gray'}}
             onClick={handleChange}
             >
                View {ChildCommentNumber} more comment(s)
            </p>
            }
            
{OpenReplyComments &&
renderReplyComment(props.parentCommentId)
}
            
        </div>
        </>
    )
}

export default ReplyComment
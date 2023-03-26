import React, {useState, useEffect} from 'react'
import './Comments.css'
import {auth, db} from '../../config/firebaseConfig'
import {useAuthState} from 'react-firebase-hooks/auth'
import {collection, query, addDoc, onSnapshot, where, deleteDoc, doc} from 'firebase/firestore'
import {toast} from 'react-toastify'

function Comments({articleId}) {
    //get user data
    const [user] = useAuthState(auth)

    //state for new comment
    const [comment, setComment] = useState('')

    //state for all comments
    const [comments, setComments] = useState([])

    const addComment = (e) => {
        e.preventDefault();
        //add a new doc to comments collection
        //data will be articleId, comment, user info
        const commentsRef = collection(db, 'comments')
        addDoc(commentsRef, {userId: user?.uid, articleId: articleId, content: comment, username: user?.displayName})
        .then(res => {
            toast("Comment added", {type: "success", autoClose: "1500"})
            //clear comment field
            setComment('')
        })
        .catch(err=>console.log(err))
    }

    //show all comments when page loads
    useEffect(
        ()=>{
            //ref to comments collection
            const commentsRef = collection(db, 'comments')
            //get the comments
            // getDocs(commentsRef)
            // .then(res => {
            //     //convert to array
            //     const comments = res.docs.map(item => (
            //         {
            //             id: item.id,
            //             ...item.data()
            //         }
            //     ))
            //     //store in state
            //     setComments(comments)
            // })
            // .catch(err=>console.log(err))

            //filter to get comments for this article
            const q = query(commentsRef, where("articleId", "==", articleId))
            //works like getDoc but reflects changes in backend
            onSnapshot(q, (snapshot)=>{
                //convert to array
                const comments = snapshot.docs.map(item => (
                    {
                        id: item.id,
                        ...item.data()
                    }
                ))
                //save to state 
                setComments(comments)
            })
            // eslint-disable-next-line
        }, []
    )

    const deleteComment = (id) => {
        deleteDoc(doc(db, 'comments', id))
        .then(res=> {
            toast("Comment deleted", {type: "success", autoClose: "1000"})
        })
        .catch(err=>console.log(err))
    }

  return (
    <div>
        <div className="comments-container">
            {
                comments.map(item => 
                    <div className="comment" key={item.id}>
                        <p><span>{item.username} </span>{item.content}</p>
                        {
                            //compare comment uid with user id to decide if there's a delete button
                            user?.uid === item.userId?
                            <button onClick={()=>deleteComment(item.id)}>Delete</button>
                            :
                            null
                        }
                    </div>
                )
            }
        </div>
        {
            user?
            <form onSubmit={addComment}>
                <input type="text" placeholder="Add comment" onChange={(e)=>setComment(e.target.value)} value={comment}/>
            </form>
            :
            <p>Login to make comments</p>
        }
    </div>
  )
}

export default Comments
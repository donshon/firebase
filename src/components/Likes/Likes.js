import React, {useState, useEffect} from 'react'
import './Likes.css'
import {FaHeart, FaRegHeart} from "react-icons/fa";
import {db, auth} from '../../config/firebaseConfig'
import {useAuthState} from 'react-firebase-hooks/auth'
//need some functions from firestore
import {collection, addDoc, getDocs, query, where, deleteDoc, doc} from 'firebase/firestore'

function Likes({articleId}) {
    //get user data
    const [user] = useAuthState(auth)
    //state for likes
    const [isLiked, setIsLiked] = useState(false)
    //state for number of likes
    const [likeCount, setLikeCount] = useState(0)

    //check if article is liked by user when page loads
    useEffect(
        ()=>{
            //did this user like this article
            const likesRef = collection(db, "Likes")
            if(user){
                const q = query(likesRef, where("articleId", "==", articleId), where("userId", "==", user?.uid))
                //see if there is a match
                getDocs(q, likesRef)
                .then(res => {
                    //match if size > 0
                    if(res.size > 0){
                        setIsLiked(true)
                    }
                })
                .catch(err=>console.log(err))
            }
            // find the like count 
            const q2 = query(likesRef, where("articleId", "==", articleId))
            getDocs(q2, likesRef)
            .then(res => {
                setLikeCount(res.size)
            })
            .catch(err=>console.log(err))
           
        }, [isLiked, user]
    )

    const handleLike = () => {
        //only work if logged in
        if(user){
            //create ref to likes collection
            const likesRef= collection(db, 'Likes')
            //add document with user id and article id
            addDoc(likesRef, {userId: user?.uid, articleId: articleId})
            .then(res=> {
                //see that its liked
                setIsLiked(true)
            })
            .catch(err=>console.log(err))
        }
    }

    const handleUnlike = () => {
        //find doc with user id and article id that match
        //need the doc id
        if(user){
            const likesRef = collection(db, "Likes")
            //set up a query to find the doc
            const q = query(likesRef, where("articleId", "==", articleId), where("userId", "==", user?.uid))
            //get the doc
            getDocs(q, likesRef)
            .then(res => {
                //console.log(res.docs[0].id)
                //this is the doc id, now delete it
                const likeId = res.docs[0].id
                deleteDoc(doc(db, "Likes", likeId))
                .then( res => {
                    //show as unliked
                    setIsLiked(false)
                })
                .catch(err=>console.log(err))
            })
            .catch(err=>console.log(err))
        }
    }

  return (
    <div>
        {
            isLiked?
            <div className="like-icon">
                <FaHeart onClick={handleUnlike}/>
                <span>{likeCount}</span>
            </div>
            :
            <div className="like-icon">
                <FaRegHeart onClick={handleLike}/>
                <span>{likeCount}</span>
            </div>
        }
    </div>
  )
}

export default Likes
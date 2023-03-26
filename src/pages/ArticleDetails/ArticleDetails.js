import React, {useState, useEffect} from 'react'
import './ArticleDetails.css'
import { useParams } from 'react-router-dom'
import {db} from '../../config/firebaseConfig'
import {getDoc, doc} from 'firebase/firestore'
import Likes from './../../components/Likes/Likes';
import Comments from '../../components/Comments/Comments'


function ArticleDetails() {
    //get the id
    const {articleId} = useParams();

    //state for article info
    const [article, setArticle] = useState('')

        //show data when page loads
    useEffect(
        ()=>{
            //set up reference to single article
            const docRef= doc(db, 'articles', articleId)
            //now get article
            getDoc(docRef)
            .then(res=> {
                console.log(res.data())
                setArticle(res.data())
            })
            .catch(err=>console.log(err))
            // eslint-disable-next-line 
        }, []
    )

  return (
    <div className="details-container">
        <h1>{article?.title}</h1>
        <h2>{article?.summary}</h2>
        <div className="details-info-container">
            <p>Category: {article?.category}</p>
            <p><span className="author-span">Author: </span>{article?.createdBy?.toUpperCase()}</p>
            <p><span className="article-span-published">Published: </span>{article?.createdAt?.toDate().toString()}</p>
            <Likes articleId={articleId}/>
        </div>
        <div className="details-content">
            <img className="details-img" src={article?.imgUrl} alt={article?.title}/>
            <p className="article-description">{article?.paragraphOne}</p>
            <p className="article-description">{article?.paragraphTwo}</p>
            <p className="article-description">{article?.paragraphThree}</p>
        </div>
        <Comments articleId={articleId}/>
    </div>
  )
}

export default ArticleDetails
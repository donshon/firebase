import React, {useState, useEffect} from 'react'
import './Banner.css'
import {db} from '../../config/firebaseConfig'
import {collection, getDocs, query, orderBy, limit} from 'firebase/firestore'
import { Link } from 'react-router-dom'

//show the 5 most recent articles
function Banner() {
    const [mainArticle, setMainArticle] = useState()
    const [otherArticles, setOtherArticles] = useState([])
    //get data when page loads
    useEffect (
        () => {
            //make reference to article collection/table
            const articleRef = collection(db, 'articles')

            //set up query to filter data by date
            const q = query(articleRef, orderBy("createdAt", "desc"), limit(5))

            //retreive document from collection/table, add id
            getDocs(q, articleRef)
            .then(res=> {
                //console.log(res.docs[0].data())
                const articles = res.docs.map(item => (
                    {
                        id: item.id,
                        ...item.data()
                    }
                ))
                //console.log(articles)
                //store in state
                setMainArticle(articles[0])
                setOtherArticles(articles.splice(1))
            })
            .catch(err=>console.log(err))

        }, []
    )

  return (
    <div className="banner-container">
        <Link to={`/article/${mainArticle?.id}`} className="main-article-container" style={{backgroundImage:`url(${mainArticle?.imgUrl})`}}>
            <div className="banner-info">
                <h2>{mainArticle?.title}</h2>
                <p>{mainArticle?.createdAt?.toDate().toDateString()}</p>
            </div>
        </Link>
        <div className="other-articles-container">
            {
                otherArticles.map(item => (
                    <Link to={`/article/${item?.id}`} key={item?.id} className="other-article-item" style={{backgroundImage:`url(${item?.imgUrl})`}}>
                        <div className="banner-info">
                            <h3>{item?.title}</h3>
                            <small>{item?.createdAt?.toDate().toDateString()}</small>
                        </div>
                    </Link>
                ))
            }
        </div>
    </div>
  )
}

export default Banner
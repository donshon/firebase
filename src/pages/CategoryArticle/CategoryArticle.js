import React, {useState, useEffect} from 'react'
import './CategoryArticle.css'
import {useParams} from 'react-router-dom'
import {db} from '../../config/firebaseConfig'
//need some functions from firestore
import {collection, getDocs, query, where} from 'firebase/firestore'

function CategoryArticle() {
    const {categoryName} = useParams();

    const [articles, setArticles] = useState([])

    //when page loads, show only articles of this category
    useEffect(
        () => {
            //make reference to article collection/table
            const articleRef = collection(db, 'articles')

            //set up query to filter data by category
            const q = query(articleRef, where('category', "==", categoryName))

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
                console.log(articles)
                //store in state
                setArticles(articles)
            })
            .catch(err => console.log(err))
        }, [categoryName]
    )

  return (
    <div className="category-articles">
        {
            articles?.length === 0?
            <p>No {categoryName} articles </p>
            :
            articles?.map(item => <p key={item.id}>{item.title}</p>)
        }
    </div>
  )
}

export default CategoryArticle
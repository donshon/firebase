import React, {useState} from 'react'
import './AddArticle.css'
import {db, auth, storage} from '../../config/firebaseConfig'
import {collection, addDoc, Timestamp} from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import {ref, uploadBytes, getDownloadURL} from 'firebase/storage'
//npm install uuid; give images unique names
import {v4} from 'uuid'
//npm install react-toastify for fancy alert pop-up
import {toast} from 'react-toastify'
import {useNavigate} from 'react-router-dom'

function AddArticle() {
    const categories = ["Health", "Food", "Travel", "Technology"]
    
    let navigate = useNavigate();

    //get user data
    const [user] = useAuthState(auth);

    //stat to hold all user data
    const [formData, setFormData] = useState({
        title: "",
        summary: "",
        paragraphOne: "",
        paragraphTwo: "",
        paragraphThree: "",
        category: "",
        imgUrl: ""
    })

    const handleSubmit = (e) => {
        e.preventDefault();

        //create reference for the image
        const imgRef = ref(storage, `images/${formData.imgUrl.name + v4()}`)
        //upload image to storage
        uploadBytes(imgRef, formData.imgUrl)
        .then( res => {
            //console.log(res.ref)
            //get the url from this reference
            getDownloadURL(res.ref)
            .then(url => {
                //now we have all data and image
                //create article reference
                const articleRef = collection(db, 'articles')
                //use adddoc to add a document
                addDoc(articleRef, {
                    title: formData.title,
                    summary: formData.summary,
                    paragraphOne: formData.paragraphOne,
                    paragraphTwo: formData.paragraphTwo,
                    paragraphThree: formData.paragraphThree,
                    category: formData.category,
                    imgUrl: url,
                    createdBy: user.displayName,
                    userId: user.uid,
                    createdAt: Timestamp.now().toDate()
                })
            })
            .then(res => {
                toast("Article saved", {type: "success", autoClose: "1500"})
                //pause b4 going back to home page
                setTimeout(()=> {
                    navigate('/')
                }, 2000)
            })
        })
        .catch(err => {
            alert("error")
        })
    
    }

  return (
    <div className="add-article-container">
        <form className="add-article-form"  onSubmit={handleSubmit}>
            <h2>Create Article</h2>
            <div className="input-group">
                <label htmlFor="title">Title</label>
                <input type="text"  id="title"
                placeholder="Maximum 100 characters"
                maxLength="100"
                onChange={(e)=> setFormData({...formData, title: e.target.value})}
                />
            </div> 
            <div className="input-group">        
                <label htmlFor="summary">Summary</label>
                <textarea id="summary"
                placeholder="Maximum 120 characters"
                maxLength="120"
                onChange={(e)=> setFormData({...formData, summary: e.target.value})}
                />
            </div> 
            <div className="input-group">
                <label htmlFor="paragraphOne">Paragraph One</label>
                <textarea name="paragraphOne" 
                placeholder="Maximum 650 characters"
                maxLength="650"
                onChange={(e)=> setFormData({...formData, paragraphOne: e.target.value})}
                />
            </div>
            <div className="input-group">
                <label htmlFor="paragraphTwo">Paragraph Two</label>
                <textarea id="paragraphTwo"
                placeholder="Maximum 650 characters"
                maxLength="650"
                onChange={(e)=> setFormData({...formData, paragraphTwo: e.target.value})}
                />
            </div>
            <div className="input-group">
                <label htmlFor="paragraphThree">Paragraph Three</label>
                <textarea id="paragraphThree" 
                placeholder="Maximum 650 characters"
                maxLength="650"
                onChange={(e)=> setFormData({...formData, paragraphThree: e.target.value})}
                />
            </div>
            <div className="input-group">
                <label htmlFor="category">Category</label>
                <select name="category"
                onChange={(e)=> setFormData({...formData, category: e.target.value})}
                >
                    <option value="">Select</option>
                    {
                        categories.map((item, index) => (
                            <option key={index} value={item}>{item}</option>
                        ))
                    }
                    
                </select>
            </div>
            <div className="input-group">
                <label>Upload Image</label>
                <input type="file" name="image" accept="image/*"
                onChange={(e)=> setFormData({...formData, img: e.target.files[0]})}
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
  )
}

export default AddArticle
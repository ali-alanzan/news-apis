import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import '../css/reset.css';
import { fetchJSON } from './utils'
import { useParams } from 'react-router-dom';


const colorMain = '#6a59ca';


export function Header({account}) {
  const acc = account && account.name ? account : false
  
  return (
    <div style={{
      width: '100%',
      backgroundColor: colorMain,
      color: '#e2e2e2',
      height: '55px',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '.5rem 4rem'
    }}>

      <div style={{flexGrow: 1}} className="logo-container">
        <h1>News App 
        
          {!acc ? '':<><button><a href="/add">Add</a></button><button><a href="/myarticles">My articles</a></button></>}

          
        </h1>
      </div>



      <div style={{}}>
        {!acc ? <Link to="/login">Login</Link>:acc.name}
        
      </div>
      

    </div>
  );
}


export function Sidebar() {
  const [articles, setArticles] = useState([]);
  useEffect(async () => {
    await fetch('/api/news').then(res => res.json().then(data => setArticles(data)));      
  }, []);
  return (
    <div style={{
      width: '30%',
      backgroundColor: colorMain,
      height: '100%',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '.5rem 4rem',
      float: 'left'
    }}>  
    


      <div className="topics-container">
        <div className="d-f">
          <a href="#1">
            Topic(123)
          </a>

          <a href="#1">
            Topic(1234)
          </a>

          <a href="#1">
            Topic(124)
          </a>

          <a href="#1">
            Topic(14)
          </a>
        </div>
      </div>



      <div className="d-f articlessidebar-container">
      {articles.length>0 && articles.map((article) => (
          <a  key={`${article._id}`} href={`/edit/${article._id}`}>{article.title}</a>
      ))}
      </div>
      

    </div>
  );
}


export function FrontPage() {
  const [articles, setArticles] = useState([]);
  useEffect(async () => {
    await fetchJSON('/api/news').then(res => setArticles(res));      

  }, [articles]);

  return (
    <div className="main">
      <div className="d-f articlessidebar-container">
      {articles.length>0 && articles.map((article) => (
        <div key={`${article._id}`}>
          <a href={`/edit/${article._id}`}>{article.title}</a>
        </div>
      ))}
       
      </div>
    </div>
  );
}



export function SingleArticle () {
  return (
    <div style={{
      width: '68%',
      float: 'left',
      margin: '2% 0 0 2%'
    }}>
      <div className="d-f articlessidebar-container">
        <h1>Title</h1>
        <span>Date mm/yy/dd</span>
        
        <div className="topics-container">
          <div className="d-f">
            <a href="#1">
              Topic(123)
            </a>

            <a href="#1">
              Topic(1234)
            </a>

            <a href="#1">
              Topic(124)
            </a>

            <a href="#1">
              Topic(14)
            </a>
          </div>
        </div>
        
        <p>
          Article text
        </p>
      </div>
    </div>
  )
}



export function AddArticle ({account}) {
  if(account.email == undefined) {
    return <h1>Please Login</h1>
  }
  const navigate = useNavigate();
  const [values, setValues] = useState({}) 
  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }
  const onAddArticle = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/news/add", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({...values, author: account.email}),
    });
    if (res.ok) {
      toast.success('Your article added successfully');
      navigate('/myarticles')

    } else {
      setError(`Failed ${res.status} ${res.statusText}`);
    }
  }
  return (
    <form onSubmit={onAddArticle}>
      <div>
        <label>Title</label>
        <input name="title" onChange={onChange} required/>
      </div>

      <div>
        <label>Text</label>
        <textarea name="text" onChange={onChange} cols="30" rows="4" required/>
      </div>

      <div>
        <label>Category</label>
        <select name="category" onChange={onChange} required>
          <option value="">--choose--</option>
          <option value="Health">Health</option>
          <option value="Technology">Technology</option>
          <option value="Global">Global</option>
        </select>
      </div>

      <div>
        <input type="submit" value="Add" />
      </div>
    </form>
  )
}


export function EditArticle({account}) {
  if(account.email == undefined) {
    return <h1>Please Login</h1>
  }
  const [values, setValues] = useState({title: '', text: '', category: ''})
  const { slug } = useParams();

  useEffect(async () => {
    await fetch(`/api/news/${slug}`).then(res => res.json().then(data => setValues(data)));      
  }, []);
  const navigate = useNavigate();
  
  const onChange = (e) => {
    setValues({...values, [e.target.name]: e.target.value })
  }
  const onAddArticle = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/news/save", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({...values, author: account.email}),
    });
    if (res.ok) {
      toast.success('Your article added successfully');
      navigate('/myarticles')

    } else {
      setError(`Failed ${res.status} ${res.statusText}`);
    }
  }
  return (
    <form onSubmit={onAddArticle}>
      <div>
        <label>Title</label>
        <input name="title" onChange={onChange} value={values.title} required/>
      </div>

      <div>
        <label>Text</label>
        <textarea name="text" onChange={onChange} cols="30" rows="4" required defaultValue={values.text} />
      </div>

      <div>
        <label>Category</label>
        <select name="category" onChange={onChange} value={values.category} required>
          <option value="">--choose--</option>
          <option value="Health">Health</option>
          <option value="Technology">Technology</option>
          <option value="Global">Global</option>
        </select>
      </div>

      <div>
        <input type="submit" value="Add" />
      </div>
    </form>
  )
}


export function MyArticles ({account}) {
  const [articles, setArticles] = useState([]);
  useEffect(async () => {
    if(account.email!=undefined&&articles.length<=0) {
      await fetch('/api/news/?author='+account.email).then(res => res.json()).then(res => setArticles(res));      
    }
    
  }, [account]);

  if(account.email==undefined) { return <p>Please login</p> }
  return (
    <div className="main">
      <h1>My Articles</h1>
      {articles.length>0 && articles.map((article) => (
        <div key={`${article._id}`}>
          <a href={`/view/${article.slug}`}>{article.title}</a>
          
          <a href={`/edit/${article.slug}`}><button>Edit</button></a>
        </div>
      ))}
    </div>
  )

}
import { Link } from "react-router-dom";
import '../css/reset.css';


const colorMain = '#6a59ca';

const styles = {
  styleFront: {
    width: '30%',
    backgroundColor: colorMain,
    height: '100%',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    padding: '.5rem 4rem',
    float: 'left'
  }
}


export function Header({account}) {
  const acc = account && account.name ? account : false
  
  const onChange = (e) => {
    let v = e.target.value;
    if(v != '') {
      window.location.href = window.location.origin+v
    }    
  }
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
        
          {!acc ? '':<select onChange={onChange}>
            <option value="">--select--</option>  
            <option value="/add">Add Post</option>  
            </select>}

          
        </h1>
      </div>



      <div style={{}}>
        {!acc ? <Link to="/login">Login</Link>:acc.name}
        
      </div>
      

    </div>
  );
}


export function Sidebar() {
  return (
    <div style={{
      ...styles.styleFront
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
        <a href="#1">
          Article title
        </a>

        <a href="#1">
        Article title
        </a>

        <a href="#1">
        Article title
        </a>

        <a href="#1">
        Article title
        </a>
      </div>
      

    </div>
  );
}


export function FrontPage() {
  return (
    <div style={{
      width: '68%',
      float: 'left',
      margin: '2% 0 0 2%'
    }}>
      <div className="d-f articlessidebar-container">
        <a href="#1">
          Article title
        </a>

        <a href="#1">
        Article title
        </a>

        <a href="#1">
        Article title
        </a>

        <a href="#1">
        Article title
        </a>
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

const onAddArticle = (e) => {
  e.preventDefault();
  console.log('submited');
}

export function AddArticle ({account}) {
  if(account.email == undefined) {
    return <h1>Please Login</h1>
  }
  return (
    <form onSubmit={onAddArticle}>
      <div>
        <label>Title</label>
        <input name="title" required/>
      </div>

      <div>
        <label>Text</label>
        <textarea name="title" cols="30" rows="4" required/>
      </div>

      <div>
        <label>Category</label>
        <select name="category" required>
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
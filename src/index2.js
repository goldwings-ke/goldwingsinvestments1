const React = require('react')
const ReactDOM = require('react-dom')
const { Route, Link, BrowserRouter } = require('react-router-dom')
const About = require('./components/About')
const Dashboard = require('./components/Dashboard') 
const Counter = require('./components/Counter') 


 

const el =
 <BrowserRouter>
      <div>
        <aside>
          <Link to={`/`}>
            <button>Dashboard 🔮</button>
          </Link>
          <Link to={`/about`}>
            <button>About 👀</button>
          </Link>
            <Link to={`/counter`}>
            <button>Counter 👀</button>
          </Link>
        </aside>

        <main>
          <Route path="/boomerang" component={Dashboard} />
           {/*codepen-specific for first page load*/}
          <Route exact path="/" component={Dashboard} />
          <Route path="/about" component={About} />
          <Route path="/counter" component={Counter} />
        </main>
      </div>
  </BrowserRouter>

  
 ReactDOM.render(
   el,
  document.getElementById('root')
 );


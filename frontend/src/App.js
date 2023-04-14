import './App.css';
import React from 'react';


class BackendSsr extends React.Component {
  render() {
    return (
      <div >
        <h3>Server side content inside React iframe (light gray)</h3>
        <div>
          <iframe title="express-app-backend" class="backend-block" src="http://localhost:4000/backend" width={1000} height={500}></iframe>
        </div>
      </div>
    );
  }
}


class BackendApi extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      logins: []
    };
  }

  render() {
    return (
      <div>
        <h3>React rendered content fetched through backend api (light red)</h3>
        <div class="frontend-block">
          <button onClick={() => {
            this.setState({ count: this.state.count + 1 });
            fetch('http://localhost:4000/db_response')
              .then(resp => resp.json())
              .then(resp => {
                // console.log(resp.response);
                this.setState({ logins: resp.response.map((el) => el.info) })
              });
          }
          }>
            DB Query: Fetch last 3 backend startup times from server
          </button>
          <ul>
            {this.state.logins.map((item, i) => {
              return <li key={i}>{item}</li>
            })}
          </ul>
        </div>
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <BackendApi />
        <BackendSsr />
      </header>
    </div>
  );
}

export default App;

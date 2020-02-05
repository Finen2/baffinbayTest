import React, { Component } from 'react';
import './App.sass';

class App extends Component {
  state = {}

  componentDidMount () {
    fetch('/data.json')
      .then(res => res.json())
      .then(data => this.setState({data}))
      .catch(err => console.error(err.message))
  }

  render() {
    if (this.state.data) {
      return (
        <div className="container flex-column-center">
          <div className="container__infonBox">
            <h3 className="container__headerText">
              Systems
            </h3>
            {System(this.state.data)}
          </div>
        </div>
      )
    }
    return (
      'Fetching data...'
    );
  }
}

function System(data){
  const systemList = [];

  const systems = data.entities.filter(system => system.type === 'System')
  const departments = data.entities.filter(department => department.type === 'Department')
  const persons = data.entities.filter(person => person.type === 'Person')

  const owners = data.relationships.filter(owner => owner.type === 'owns')
  const belongs = data.relationships.filter(belong => belong.type === 'belongs_to')
  const develops = data.relationships.filter(develop => develop.type === 'develops')

  systems.forEach((system) => {
    const own = owners.filter(owner => owner.end === system.id)
    const b_to = belongs.filter(belong => belong.start === system.id)
    const dev = develops.filter(dev => dev.end === system.id)

    let systemOwner = own.map(per => persons.find(p => p.id === per.start))
    let systemDepartment = b_to.map(dep => departments.find(d => d.id === dep.end))
    let systemDev = dev.map(dev => persons.find(p => p.id === dev.start))

    let systemItem = {
      id: system.id,
      system: system,
      owner: systemOwner,
      department: systemDepartment,
      developer: systemDev
    }
    systemList.push(systemItem)
  })
  return (
    <div>
      {systemList.map(item => (
        <div className='item flex-space__around' key={item.id}>
          <div className="item__text"><strong>{item.system.name}</strong></div>

          <div className="item__text"><strong>Owner:</strong>
            {item.owner
              ? item.owner.map(owner =>
                  owner.name ? <p key={owner.id} >Name: {owner.name} <br /> Contact: {owner.email} </p> : null
                )
              : null}
          </div>
          <div className="item__text"> <strong>Department:</strong>
            {item.department
              ? item.department.map(dep =>
                  dep.name ? <p key={dep.id}>{dep.name}</p> : null
                )
              : null}
          </div>
          <div className="item__text"> <strong>Developers: </strong>
            {item.developer.length
              ? item.developer.map(dev =>
                  dev.name ? <p key={dev.id}>Name: {dev.name} <br /> {dev.email}</p> : null
                )
              : 'No registerd developers'}
          </div>
        </div>
      ))}
    </div>
  );
}


export default App;

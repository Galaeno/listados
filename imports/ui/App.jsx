import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Tasks } from '../api/tasks.js';
import Task from './Task.jsx';
import ReactDOM from 'react-dom';
import AccountsUIWrapper from './AccountsUIWrapper.jsx';
import { Meteor } from 'meteor/meteor';
 
// App component - represents the whole app
class App extends Component { 
    constructor(props) {
      super(props);
   
      this.state = {
        hideCompleted: false,
      };
    }

    toggleHideCompleted() {
      this.setState({
        hideCompleted: !this.state.hideCompleted,
      });
    }

    handleSubmit(event) {

    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
 
    Meteor.call('tasks.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = '';
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }
 
  render() {
    return (
      <div className="container">
        <AccountsUIWrapper />
        { this.props.currentUser ?
        <header>
          <h1>Tareas: ({this.props.incompleteCount})</h1>
          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}/>
            Oculta tareas realizadas
          </label>
          
          <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
            <input
              type="text"
              ref="textInput"
              placeholder="Escribe para añadir otra tarea..." />
            <span className="agregar" onClick={this.handleSubmit.bind(this)}>+</span>
          </form>
        </header>:
        <header className="header">
          Inicia sesión para poder utilizar esta aplicación!
        </header>
        }
        { this.props.currentUser ?
        <ul>
          {this.renderTasks()}
        </ul>: ''
        }
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};
 
export default createContainer(() => {
  Meteor.subscribe('tasks');
  var query = {}, _username = ''

 if(Meteor.user() != undefined)
    _username = Meteor.user().username

  return {
    tasks: Tasks.find({username:_username}, {sort: {checked: 1, texto: 1}}).fetch(),
    incompleteCount: Tasks.find({checked: {$ne: true},username:_username}).count(),
    currentUser: Meteor.user(),
  };
}, App);
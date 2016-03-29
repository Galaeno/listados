import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Users } from '../api/tasks.js';

// App component - represents the whole app
class Footer extends Component {
  render() {
    return (
      <div>
        Usuarios registrados: {this.props.usuariosRegistrados}
        <br/>
        © Copyright {this.props.fechaActual}, Gonzalo Henríquez
      </div>
    );
  }
}

Footer.propTypes = {
  fechaActual: PropTypes.number.isRequired,
  usuariosRegistrados: PropTypes.number.isRequired,
};
 
export default createContainer(() => {
  Meteor.subscribe('userData');
  
  return {
    fechaActual: new Date().getFullYear(),
    usuariosRegistrados: Meteor.users.find().count(),
  };
}, Footer);
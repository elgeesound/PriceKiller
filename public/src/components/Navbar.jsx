import React, { Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import { setUserState, userLogout } from '../actions/main_a.jsx';
import { setFavorites } from '../actions/favorites_a.jsx';
import App from './App.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import Logout from './Logout.jsx';
import Search from './Search.jsx';
import Favorites from './Favorites.jsx';
import Auth0 from "auth0-lock";
import Auth from "../../../Auth/Auth.js";
import axios from 'axios';
import Redirect from 'react-router-dom';
const Lock = require('../../../Auth/Auth.js').lock;

import { Route, Link } from 'react-router-dom';
const auth = new Auth;

const mapStateToProps = (state) => {
 return {userProfile: state.userProfile};
}

const mapDispatchToProps = (dispatch) => {
  return {
    setUserState: (user) => {
      dispatch(setUserState(user))
    },
    userLogout: () => {
      dispatch(userLogout())
    },
    setFavorites: (favorites) => {
      dispatch(setFavorites(favorites))
    }
  }
}

class Navbar extends Component {

  componentWillMount() {
    if (auth.isAuthenticated()) {
      let localProfile = JSON.parse(localStorage.getItem('profile'));
    } else {
      Lock.show();
    }
  }

  componentDidMount() {
    let self = this;
    auth.handleAuthentication();
    Lock.on('authenticated', function(authResult) {

      if (!authResult.accessToken) return;

      Lock.getUserInfo(authResult.accessToken, function(error, profile) {
        let user = {};
        user.username = profile.nickname;
        user.email = profile.email;
        user.picture = profile.picture;

        axios.post('/api/auth/signup', user)
          .then(function(res) {
          console.log(res, 'INSIDE LOCK GET USER INFO')
          self.props.setUserState(res.data);
          self.props.setFavorites(res.data.favorites);
          // window.location.reload();
       })
        .catch(function(error) {
          console.log(error);
        })
      });

    });

    Lock.on('authorization_error', function(error) {
      console.log('authorization_error', error);
    });
  }

  activateMenu(e) {
    $('.navbar-menu').toggleClass('is-active')
  }

  render() {
    let self = this;
    return(<div>
      <nav className="navbar is-transparent">
        <div className="navbar-brand">
          <a className="navbar-item" href="pricekiller.herokuapp.com">
            <img src="https://s3-us-west-1.amazonaws.com/hackreactor27/pricekiller_logov1.png" alt="Pricekiller, kill your prices" width="112" height="28"/>
          </a>
          <button
            className="button navbar-burger"
            data-target="navbarExampleTransparentExample"
            onClick={(e) => {this.activateMenu(e)}}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div id="navbarExampleTransparentExample" className="navbar-menu">
          <div className="navbar-start">
            <div>
              <ul>
                <li><button onClick={() => {auth.logout(); window.location.reload();}}>Signout</button></li>
              </ul>
            <a className="navbar-item" href="/">
              Home
            </a>
            <div className="navbar-item has-dropdown is-hoverable">
              <a className="navbar-link" href="">
                Navigation
              </a>
              <div className="navbar-dropdown is-boxed">
                <Link
                  className="navbar-item"
                  to="/search"
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Search
                </Link>
                <Link
                  className="navbar-item"
                  to="/favorites"
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Favorites
                </Link>
                <Link
                  className="navbar-item"
                  to="/chart"
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Chart
                </Link>
                <a
                  className="navbar-item"
                  href=""
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Getting Started
                </a>
                <a
                  className="navbar-item"
                  href=""
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Who We Are
                </a>
                <hr className="navbar-divider"/>
                <a
                  className="navbar-item"
                  href=""
                  onClick={(e) => {this.activateMenu(e)}}
                >
                  Preferences
                </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <hr/>
    </div>
    )
  }
}

Navbar = connect(mapStateToProps, mapDispatchToProps)(Navbar);

export default Navbar;
// React additions
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Individual Pages
import Home from './pages/home';
import Feed from './pages/feed';
import Error404 from './pages/error404';
import Post from './pages/post';
import Publish from './pages/publish';
import Profile from './pages/profile';
import Search from './pages/search';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgetPassword from './pages/ForgetPassword';
import NewPassword from './pages/NewPassword';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import FirstLogin from './pages/FirstLogin';

import SearchTypeProvider from './components/Search/SearchTypeContext';

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/feed" component={Feed} />
          <Route exact path="/profile" component={Profile} />
          <Route exact path="/publish" component={Publish} />
          <Route exact path="/first" component={FirstLogin} />
          <Route exact path="/about" component={AboutUs} />
          <Route exact path="/contact" component={Contact} />
          <Route exact path="/first" component={FirstLogin} />          
          <Route exact path="/search">
            <SearchTypeProvider>
              <Search />
            </SearchTypeProvider>
          </Route>
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/post" component={Post} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route
            exact
            path="/forgetPassword"
            component={ForgetPassword}
          />
          <Route exact path="/newPassword" component={NewPassword} />
          <Route component={Error404} />
        </Switch>
      </Router>
    </>
  );
}

export default App;

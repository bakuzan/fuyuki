import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './HeaderBar.scss';

const NavItem = ({ children }: { children: React.ReactElement }) => (
  <div>{children}</div>
);

class NavMenu extends Component<any, { collapsed: boolean }> {
  static displayName = NavMenu.name;

  constructor(props: any) {
    super(props);

    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar() {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render() {
    return (
      <header>
        <nav className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3">
          <div>
            <NavLink to="/">Fuyuki</NavLink>
          </div>

          <ul className="navbar-nav flex-grow">
            <NavItem>
              <NavLink className="text-dark" to="/">
                Home
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-dark" to="/counter">
                Counter
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-dark" to="/fetch-data">
                Fetch data
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="text-dark" to="/groups">
                Group list
              </NavLink>
            </NavItem>
          </ul>
        </nav>
      </header>
    );
  }
}

export default NavMenu;

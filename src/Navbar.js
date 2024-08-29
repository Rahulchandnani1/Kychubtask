import React from 'react';
import { Layout, Avatar, Menu, Button } from 'antd';
import "./App.css";
import userimg from "./newuser.jpg";
const { Header } = Layout;

const Navbar = (props) => {
  return (
    <Header className='navbar'>
      <div className="logo">RC's Store</div>
      <div className='profile'>
        <Avatar src={userimg} /> User Profile
        <Button onClick={props.toggleTheme} style={{ float: 'right', margin: '16px' }}>
          Toggle to Dark Mode
        </Button></div>
    </Header>
  );
};

export default Navbar;

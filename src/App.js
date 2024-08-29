import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ProductDetails from './ProductDetails';
import CompareProducts from './CompareProducts';
import { Layout, Button } from 'antd';
import './App.css';
import Navbar from './Navbar';
import Sidebar from "./Sidebar";
const { Header, Content, Sider } = Layout;

const App = () => {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme === 'light' ? 'dark' : 'light');
  };

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>

        <Navbar toggleTheme={toggleTheme} />


        <Layout>
          <Sidebar theme={theme} />
          <Layout style={{ padding: '0 24px', minHeight: 280 }}>
            <Content className="content">
              <Routes>
                <Route path="/" element={<ProductDetails />} />
                <Route path="/compare" element={<CompareProducts />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;

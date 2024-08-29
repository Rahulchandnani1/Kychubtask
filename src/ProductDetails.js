import React, { useState, useEffect } from 'react';
import { Table, Button, notification } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const [data, setData] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://dummyjson.com/products')
      .then(response => {
        setData(response.data.products);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const handleCompare = (product) => {
    const updatedSelectedProducts = [...selectedProducts, product];
    if (updatedSelectedProducts.length > 4) {
      notification.error({
        message: 'Error',
        description: 'You can only compare up to 4 products.',
      });
      return;
    }
    setSelectedProducts(updatedSelectedProducts);
    navigate('/compare', { state: { selectedProducts: updatedSelectedProducts } });
    notification.success({
      message: 'Product Added',
      description: 'Product has been added to the comparison.',
    });
  };

  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: 'Brand',
      dataIndex: 'brand',
      sorter: (a, b) => a.brand.localeCompare(b.brand),
    },
    {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      sorter: (a, b) => a.category.localeCompare(b.category),
    },
    {
      title: 'Compare',
      render: (text, record) => (
        <Button
          disabled={selectedProducts.some(product => product.id === record.id)}
          onClick={() => handleCompare(record)}
        >
          Compare
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 10 }}
      rowKey="id"
    />
  );
};

export default ProductDetails;

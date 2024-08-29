import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Table, Button, Modal, notification } from 'antd';
import axios from 'axios';

const CompareProducts = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [modalVisible, setModalVisible] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState(location.state?.selectedProducts || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.state?.selectedProducts) {
      setSelectedProducts(location.state.selectedProducts);
    }
  }, [location.state?.selectedProducts]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://dummyjson.com/products');
      setAllProducts(response.data.products);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleAddMore = () => {
    fetchProducts();
    setModalVisible(true);
  };

  const handleAddSelected = () => {
    const selectedRows = allProducts.filter(product => selectedRowKeys.includes(product.id));
    const newSelectedProducts = selectedRows.filter(
      (row) => !selectedProducts.some((product) => product.id === row.id)
    );
    if (newSelectedProducts.length + selectedProducts.length > 4) {
      notification.error({
        message: 'Error',
        description: 'You can only compare up to 4 products.',
      });
      return;
    }
    setSelectedProducts(prevSelectedProducts => [...prevSelectedProducts, ...newSelectedProducts]);
    setModalVisible(false);
    notification.success({
      message: 'Products Added',
      description: 'Products have been added.',
    });
  };

  const handleRemoveProduct = (productId) => {
    const updatedProducts = selectedProducts.filter(product => product.id !== productId);
    setSelectedProducts(updatedProducts);
    notification.info({
      message: 'Product Removed',
      description: 'Product has been removed.',
    });
  };

  const handleRowSelection = (selectedRowKeys) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const columns = [
    {
      title: 'Feature',
      dataIndex: 'feature',
      key: 'feature',
    },
    ...selectedProducts.map(product => ({
      title: product.title,
      dataIndex: product.id,
      key: product.id,
      render: (text, record) => record[product.id],
    })),
  ];

  const data = [
    {
      key: 'brand',
      feature: 'Brand',
      ...selectedProducts.reduce((acc, product) => {
        acc[product.id] = product.brand;
        return acc;
      }, {}),
    },
    {
      key: 'price',
      feature: 'Price',
      ...selectedProducts.reduce((acc, product) => {
        acc[product.id] = `$${product.price}`;
        return acc;
      }, {}),
    },
    {
      key: 'category',
      feature: 'Category',
      ...selectedProducts.reduce((acc, product) => {
        acc[product.id] = product.category;
        return acc;
      }, {}),
    },
    {
      key: 'rating',
      feature: 'Rating',
      ...selectedProducts.reduce((acc, product) => {
        acc[product.id] = product.rating;
        return acc;
      }, {}),
    },
    {
      key: 'description',
      feature: 'Description',
      ...selectedProducts.reduce((acc, product) => {
        acc[product.id] = product.description;
        return acc;
      }, {}),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        bordered
      />
      <div style={{ marginTop: 20 }}>
        {selectedProducts.map(product => (
          <Button
            key={product.id}
            onClick={() => handleRemoveProduct(product.id)}
            style={{ marginRight: 10 }}
          >
            Remove {product.title}
          </Button>
        ))}
        <Button onClick={handleAddMore} disabled={selectedProducts.length >= 4}>
          Add More
        </Button>
      </div>

      <Modal
        title="Add More Products"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            Cancel
          </Button>,
          <Button
            key="add"
            type="primary"
            onClick={handleAddSelected}
            disabled={selectedRowKeys.length === 0}
          >
            Add Selected
          </Button>,
        ]}
      >
        <div style={{ height: '400px', overflow: 'auto' }}>
          <Table
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys,
              onChange: handleRowSelection,
            }}
            columns={[
              { title: 'Product Name', dataIndex: 'title', key: 'title' },
              { title: 'Brand', dataIndex: 'brand', key: 'brand' },
              { title: 'Price', dataIndex: 'price', key: 'price' },
              { title: 'Category', dataIndex: 'category', key: 'category' },
            ]}
            dataSource={allProducts}
            rowKey="id"
            loading={loading}
            pagination={false}
            scroll={{ y: 300 }} 
          />
        </div>
      </Modal>

      <div style={{ marginTop: 20 }}>
        <Button
          onClick={() => navigate('/')}
          disabled={selectedProducts.length < 2} 
        >
          Back to Products Page
        </Button>
      </div>
    </>
  );
};

export default CompareProducts;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BillingSystem.css';

const BillingSystem = () => {
  const [items, setItems] = useState([]);
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState(0);
  const [itemCode, setItemCode] = useState('');
  const [price, setPrice] = useState(0);
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [userBills, setUserBills] = useState([]);

  const handleItemNameChange = (e) => {
    setItemName(e.target.value);

    switch (e.target.value.toLowerCase()) {
      case 'groceries':
        setItemCode('GR001');
        setPrice(200);
        break;
      case 'fruits':
        setItemCode('FR001');
        setPrice(180);
        break;
      case 'vegetables':
        setItemCode('VEG001');
        setPrice(20);
        break;
      case 'moye moye':
        setItemCode('moye001');
        setPrice(100);
        break;
      case 'bread':
        setItemCode('BR001');
        setPrice(30);
        break;
      case 'milk':
        setItemCode('ML001');
        setPrice(50);
        break;
      case 'eggs':
        setItemCode('EG001');
        setPrice(40);
        break;
      default:
        setItemCode('');
        setPrice(0);
        break;
    }
  };

  const addItem = () => {
    const newItem = {
      itemName,
      quantity,
      itemCode,
      price,
      total: quantity * price,
    };

    setItems([...items, newItem]);
    setItemName('');
    setQuantity(0);
    setItemCode('');
    setPrice(0);
  };

  const deleteItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.total, 0);
  };

  const handlePost = () => {
    const billData = {
      customerName,
      mobileNumber,
      items,
    };

    axios.post('http://localhost:5000/register', billData)
      .then((response) => {
        const result = response.data;
        if (result) {
          alert('Saved successfully');
          setCustomerName('');
          setMobileNumber('');
          setItems([]);
        }
      })
      .catch(() => {
        alert('Not posted');
      });
  };

  const printBill = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Final Bill</title></head><body>');
    printWindow.document.write(`<h1>Final Bill - Bill Number: ${Math.floor(Math.random() * 1000000)}</h1>`);
    printWindow.document.write(`<p><strong>Customer Name:</strong> ${customerName}</p>`);
    printWindow.document.write(`<p><strong>Mobile Number:</strong> ${mobileNumber}</p>`);
    printWindow.document.write('<table border="1">');
    printWindow.document.write('<thead><tr><th>Item Name</th><th>Quantity</th><th>Item Code</th><th>Price</th><th>Total</th></tr></thead>');
    printWindow.document.write('<tbody>');
    items.forEach((item) => {
      printWindow.document.write('<tr>');
      printWindow.document.write(`<td>${item.itemName}</td>`);
      printWindow.document.write(`<td>${item.quantity}</td>`);
      printWindow.document.write(`<td>${item.itemCode}</td>`);
      printWindow.document.write(`<td>Rs ${item.price.toFixed(2)}</td>`);
      printWindow.document.write(`<td>Rs ${item.total.toFixed(2)}</td>`);
      printWindow.document.write('</tr>');
    });
    printWindow.document.write('</tbody></table>');
    printWindow.document.write(`<p><strong>Total:</strong> Rs ${calculateTotal().toFixed(2)}</p>`);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  useEffect(() => {
    if (customerName) {
      axios.get(`http://localhost:5000/bills/${customerName}`)
        .then((response) => {
          setUserBills(response.data);
        })
        .catch(() => {
          alert('Failed to fetch user bills');
        });
    }
  }, [customerName]);

  const renderUserBills = () => {
    if (userBills.length === 0) {
      return <p>No recent bills for this customer</p>;
    }

    return (
      <div>
        <h2>Recent Bills for {customerName}</h2>
        <ul>
          {userBills.map((bill) => (
            <li key={bill.billNumber}>
              Bill Number: {bill.billNumber}, Total: Rs {bill.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="billing-system-container">
      <div className="details-box">
        <div className="customer-details">
          <h2>Customer Details</h2>
          <div className="form-group">
            <label>Customer Name:</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Mobile Number:</label>
            <input type="text" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="item-details">
        <h2>Add Item</h2>
        <div className="form-group">
          <label>Item Name:</label>
          <input type="text" value={itemName} onChange={handleItemNameChange} />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Item Code:</label>
          <input type="text" value={itemCode} readOnly />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
        </div>
        <button className="add-button" onClick={addItem}>
          Add Item
        </button>
      </div>

      <div className="total-details">
        <h2>Bill Details</h2>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Item Code</th>
              <th>Price</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index}>
                <td>{item.itemName}</td>
                <td>{item.quantity}</td>
                <td>{item.itemCode}</td>
                <td>Rs {item.price.toFixed(2)}</td>
                <td>Rs {item.total.toFixed(2)}</td>
                <td>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total">Total: Rs {calculateTotal().toFixed(2)}</div>

        <div className="action-buttons">
          <button className="print-button" onClick={printBill}>
            Print
          </button>
          <button onClick={handlePost}>Save</button>
        </div>

        <button onClick={renderUserBills}>User Info</button>
        {renderUserBills()}
      </div>
    </div>
  );
};

export default BillingSystem;
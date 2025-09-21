import React, { useState, useEffect, useCallback } from 'react';
import { invoicesAPI } from '@/services';
import { useAuth } from '@/hooks/useAuth';


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { userRole } = useAuth();

  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await invoicesAPI.getAll(currentPage, 10);
      setInvoices(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading invoices:', error);
      setInvoices([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const handleStatusUpdate = async (invoiceId, newStatus) => {
    try {
      await invoicesAPI.updateStatus(invoiceId, {
        status: newStatus,
        reason: 'Updated via admin panel'
      });
      loadInvoices(); // Reload to show updated status
    } catch (error) {
      console.error('Error updating invoice status:', error);
      alert('Failed to update invoice status');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'success';
      case 'UNPAID': return 'warning';
      case 'OVERDUE': return 'error';
      case 'CANCELLED': return 'error';
      default: return 'info';
    }
  };

  const canUpdateStatus = (currentStatus, newStatus) => {
    const validTransitions = {
      'DRAFT': ['UNPAID'],
      'UNPAID': ['PAID'],
      'PAID': ['CANCELLED']
    };
    return validTransitions[currentStatus]?.includes(newStatus);
  };

  if (loading) {
    return <div className="loading">Loading invoices...</div>;
  }

  return (
    <div className="invoice-list">
      <div className="list-header">
        <h2>Invoice Management</h2>
        {(userRole === 'MANAGER' || userRole === 'RECEPTIONIST') && (
          <button className="btn-primary">Create Invoice</button>
        )}
      </div>

      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>User</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map(invoice => (
              <tr key={invoice.invoiceId}>
                <td className="invoice-number">
                  {invoice.invoiceNumber}
                </td>
                <td className="customer-name">
                  {invoice.customerName}
                </td>
                <td className="amount">
                  ${invoice.totalAmount?.toFixed(2)}
                </td>
                <td className="user-name">
                  {invoice.userName || 'N/A'}
                </td>
                <td>
                  <span className={`status-badge ${getStatusColor(invoice.status)}`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="due-date">
                  {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : 'N/A'}
                </td>
                <td className="actions">
                  <button className="btn-secondary">View</button>
                  {(userRole === 'MANAGER' || userRole === 'RECEPTIONIST') && (
                    <>
                      {canUpdateStatus(invoice.status, 'PAID') && (
                        <button
                          className="btn-success"
                          onClick={() => handleStatusUpdate(invoice.invoiceId, 'PAID')}
                        >
                          Mark Paid
                        </button>
                      )}
                      {canUpdateStatus(invoice.status, 'CANCELLED') && (
                        <button
                          className="btn-danger"
                          onClick={() => handleStatusUpdate(invoice.invoiceId, 'CANCELLED')}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => prev - 1)}
        >
          Previous
        </button>
        <span>Page {currentPage + 1} of {totalPages}</span>
        <button
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(prev => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default InvoiceList;

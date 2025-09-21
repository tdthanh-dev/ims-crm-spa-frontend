import React, { useState, useEffect, useCallback } from 'react';
import { servicesAPI } from '@/services';
import { useAuth } from '@/hooks/useAuth';


const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { userRole } = useAuth();

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      const response = await servicesAPI.getAll(currentPage, 10);
      setServices(response.data.content || []);
      setTotalPages(response.data.totalPages || 0);
    } catch (error) {
      console.error('Error loading services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleDelete = async (serviceId) => {
    if (userRole !== 'MANAGER') {
      alert('Only managers can delete services');
      return;
    }

    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await servicesAPI.delete(serviceId);
        loadServices(); // Reload the list
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete service');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading services...</div>;
  }

  return (
    <div className="service-list">
      <div className="list-header">
        <h2>Service Management</h2>
        {userRole === 'MANAGER' && (
          <button className="btn-primary">Add New Service</button>
        )}
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.serviceId} className="service-card">
            <div className="service-header">
              <h3>{service.name}</h3>
              <span className={`status-badge ${service.isActive ? 'active' : 'inactive'}`}>
                {service.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="service-details">
              <p><strong>Code:</strong> {service.code}</p>
              <p><strong>Category:</strong> {service.category}</p>
              <p><strong>Price:</strong> ${service.basePrice}</p>
              <p><strong>Duration:</strong> {service.durationMin} min</p>
            </div>

            {userRole === 'MANAGER' && (
              <div className="service-actions">
                <button className="btn-secondary">Edit</button>
                <button
                  className="btn-danger"
                  onClick={() => handleDelete(service.serviceId)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
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

export default ServiceList;

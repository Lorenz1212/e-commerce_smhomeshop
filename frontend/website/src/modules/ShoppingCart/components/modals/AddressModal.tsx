import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaTrashAlt, FaInfoCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import { fetchCustomerAddress } from '@/services/GetAddress';
import { CustomerAddressModel } from '@/Model/DataModel';

interface Props {
  onSetAddress: (value: CustomerAddressModel) => void;
  setShowAddressModal: (close: boolean) => void;
}

const AddressModal: React.FC<Props> = ({ onSetAddress, setShowAddressModal }) => {

  const [customerAddress, setCustomerAddress] = useState<CustomerAddressModel[]>([]);

  useEffect(() => {
    fetchCustomerAddress()
      .then((data) => setCustomerAddress(data))
      .catch(console.error);
  }, []);

  // Confirm and set address
  const handleSetAddress = (id: string) => {
    const address = customerAddress.find(a => a.id_encrypted === id);
    if (!address) return;

    Swal.fire({
      title: 'Use this address?',
      text: address.full_address,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes, use it',
      cancelButtonText: 'Cancel'
    }).then((result:any) => {
      if (result.isConfirmed) {
        onSetAddress(address);
        Swal.fire('Selected!', 'This address will be used.', 'success');
        setShowAddressModal(false)
      }
    });
  };

  // Confirm and remove address
  const handleRemoveAddress = (id: string) => {
    const address = customerAddress.find(a => a.id_encrypted === id);
    if (!address) return;

    Swal.fire({
      title: 'Remove this address?',
      text: address.full_address,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, remove',
      cancelButtonText: 'Cancel'
    }).then((result:any) => {
      if (result.isConfirmed) {
        // Remove from local state
        setCustomerAddress(prev => prev.filter(a => a.id_encrypted !== id));

        Swal.fire('Removed!', 'The address has been removed.', 'success');
      }
    });
  };

  return (
    <div className="popup-whole">
      <div className="modal-content">
        <h2 className="modal-title">
          {customerAddress.length < 0 && (
            `Select Address`
          )}
          </h2>
        <div className="address-list">
          {customerAddress.length === 0 && (
            <div className='noAddress'>
              <FaInfoCircle className="noAddressIcon" />
              <p className="no-address">No address available</p>
            </div>
          )}

          {customerAddress.map((address) => (
            <div key={address.id_encrypted} className="address-card">
              <span className="address-text">{address.full_address}</span>
              
              <div className="address-actions">
                <button
                  className="set-address-btn"
                  onClick={() => handleSetAddress(address.id_encrypted)}
                  title="Set this address"
                >
                  <FaCheckCircle />
                </button>

                <button
                  className="remove-address-btn"
                  onClick={() => handleRemoveAddress(address.id_encrypted)}
                  title="Remove this address"
                >
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export { AddressModal };

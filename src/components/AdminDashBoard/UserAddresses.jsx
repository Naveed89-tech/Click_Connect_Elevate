import {
  useEffect,
  useState,
} from 'react';

import {
  collection,
  getDocs,
} from 'firebase/firestore';
import toast from 'react-hot-toast';
import {
  FiArrowLeft,
  FiEdit,
  FiHome,
  FiMapPin,
  FiPhone,
  FiPlus,
  FiTrash2,
} from 'react-icons/fi';
import {
  Link,
  useParams,
} from 'react-router-dom';

import { db } from '../../firebase';

const UserAddresses = () => {
  const { userId } = useParams();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const addressesRef = collection(db, "users", userId, "addresses");
        const snapshot = await getDocs(addressesRef);

        const addressesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAddresses(addressesData);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError("Failed to load addresses");
        toast.error("Could not load addresses");
      } finally {
        setLoading(false);
      }
    };

    fetchAddresses();
  }, [userId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow max-w-2xl mx-auto mt-8">
        <div className="text-red-500 font-medium text-lg mb-4">{error}</div>
        <Link
          to={`/admin/users/${userId}/profile`}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Back button */}
      <Link
        to={`/admin/users/${userId}/profile`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <FiArrowLeft className="mr-1" /> Back to profile
      </Link>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Saved Addresses</h1>

        <div className="flex gap-2">
          <Link
            to={`/admin/users/${userId}/addresses/new`}
            className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            <FiPlus className="mr-1" /> Add Address
          </Link>
        </div>
      </div>

      {/* Addresses list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {addresses.length ? (
          <div className="divide-y divide-gray-200">
            {addresses.map((address) => (
              <div key={address.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-medium text-gray-900 flex items-center">
                        {address.label || "Address"}
                        {address.isDefault && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-start text-gray-600">
                          <FiMapPin className="mr-2 mt-1 text-gray-400 flex-shrink-0" />
                          <div>
                            {address.full || (
                              <>
                                {address.street && <p>{address.street}</p>}
                                {address.city &&
                                  address.state &&
                                  address.postalCode && (
                                    <p>
                                      {address.city}, {address.state}{" "}
                                      {address.postalCode}
                                    </p>
                                  )}
                                {address.country && <p>{address.country}</p>}
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {address.phone && (
                          <div className="flex items-center text-gray-600">
                            <FiPhone className="mr-2 text-gray-400" />
                            {address.phone}
                          </div>
                        )}

                        {address.instructions && (
                          <div className="text-sm text-gray-500">
                            <p className="font-medium">
                              Delivery instructions:
                            </p>
                            <p>{address.instructions}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                      title="Edit address"
                    >
                      <FiEdit className="h-5 w-5" />
                    </button>
                    <button
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                      title="Delete address"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FiHome className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No saved addresses
            </h3>
            <p className="mt-1 text-gray-500">
              This user hasn't saved any addresses yet.
            </p>
            <div className="mt-6">
              <Link
                to={`/admin/users/${userId}/addresses/new`}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                <FiPlus className="mr-1" /> Add Address
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAddresses;

import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function ViewAccountPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    getContractOwner,
    getAdminList,
  } = useContext(DTraceContext);
  const [role, setRole] = useState<roles | null>(null);

  useEffect(() => {
    checkIfWalletIsConnected();

    if (currentAccount) {
      console.log('currentAccount', currentAccount);

      checkAccountType(currentAccount).then((accountType) => {
        setRole(accountType as roles);
      });
    } else {
      setRole(null);
    }
  }, [currentAccount]);

  console.log('role', role);
  // ---------------------------------------------------------------------//

  const [isLoaded, setIsLoaded] = useState(false);
  const [contractOwnerAddress, setContractOwnerAddress] = useState('');
  const [adminAddresses, setAdminAddresses] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contractOwnerAddress = await getContractOwner();
      setContractOwnerAddress(contractOwnerAddress);
      const adminAddresses = await getAdminList();
      setAdminAddresses(adminAddresses);

      setIsLoaded(true);
      toast.success('Accounts retrieved successfully!');
    } catch (error) {
      toast.error('Error retrieving account');
    }
  };

  return (
    <Layout
      currentPage="/view-accounts"
      currentRole={
        role !== null
          ? ((role.toLowerCase() === 'owneroradmin'
              ? 'admin'
              : role.toLowerCase()) as roles)
          : 'guest'
      }
    >
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/view-accounts'].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              View
            </button>
          </form>
        </div>

        {isLoaded && (
          <>
            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-5">
              Admin Accounts
            </h2>
            <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <colgroup>
                <col style={{ width: '80px' }} />
                <col style={{ width: '100%' }} />
              </colgroup>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    NO
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Account Address
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">{1}</td>
                  <td className="px-6 py-4 flex items-center">
                    {contractOwnerAddress}
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                      Contract Owner
                    </span>
                  </td>
                </tr>
                {adminAddresses.map((address, index) => (
                  <tr
                    key={`${index}-${address}`}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-4">{index + 2}</td>
                    <td className="px-6 py-4">{address}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-5">
              Farm Accounts
            </h2>
            <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <colgroup>
                <col style={{ width: '35%' }} />
                <col style={{ width: '65%' }} />
              </colgroup>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" colSpan={2} className="px-6 py-3">
                    Farm Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Farm ID
                  </th>
                  <td className="px-6 py-4">123</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Variety Code
                  </th>
                  <td className="px-6 py-4">D24</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Harvested Date & Time
                  </th>
                  <td className="px-6 py-4">2021-08-01 12:00:00</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Durian Image
                  </th>
                  <td className="px-6 py-4">
                    <img
                      // src={durianDetails.farmDetails[4]}
                      src={'https://i.imgur.com/4a4fXHl.jpg'}
                      alt="Durian"
                      className="w-32 h-32 rounded-lg object-contain border"
                    />
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Condition
                  </th>
                  <td className="px-6 py-4">
                    {/* {ratings[durianDetails.farmDetails[5]]} */}
                    Hello
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-5">
              Distribution Center Accounts
            </h2>
            <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <colgroup>
                <col style={{ width: '35%' }} />
                <col style={{ width: '65%' }} />
              </colgroup>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" colSpan={2} className="px-6 py-3">
                    Farm Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Farm ID
                  </th>
                  <td className="px-6 py-4">123</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Variety Code
                  </th>
                  <td className="px-6 py-4">D24</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Harvested Date & Time
                  </th>
                  <td className="px-6 py-4">2021-08-01 12:00:00</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Durian Image
                  </th>
                  <td className="px-6 py-4">
                    <img
                      // src={durianDetails.farmDetails[4]}
                      src={'https://i.imgur.com/4a4fXHl.jpg'}
                      alt="Durian"
                      className="w-32 h-32 rounded-lg object-contain border"
                    />
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Condition
                  </th>
                  <td className="px-6 py-4">
                    {/* {ratings[durianDetails.farmDetails[5]]} */}
                    Hello
                  </td>
                </tr>
              </tbody>
            </table>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Retailer Accounts
            </h2>
            <div>There are no retailer accounts yet.</div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Consumer Accounts
            </h2>
            <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <colgroup>
                <col style={{ width: '35%' }} />
                <col style={{ width: '65%' }} />
              </colgroup>
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" colSpan={2} className="px-6 py-3">
                    Farm Details
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Farm ID
                  </th>
                  <td className="px-6 py-4">123</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Variety Code
                  </th>
                  <td className="px-6 py-4">D24</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Harvested Date & Time
                  </th>
                  <td className="px-6 py-4">2021-08-01 12:00:00</td>
                </tr>
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Durian Image
                  </th>
                  <td className="px-6 py-4">
                    <img
                      // src={durianDetails.farmDetails[4]}
                      src={'https://i.imgur.com/4a4fXHl.jpg'}
                      alt="Durian"
                      className="w-32 h-32 rounded-lg object-contain border"
                    />
                  </td>
                </tr>
                <tr className="bg-white dark:bg-gray-800">
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    Condition
                  </th>
                  <td className="px-6 py-4">
                    {/* {ratings[durianDetails.farmDetails[5]]} */}
                    Hello
                  </td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </Layout>
  );
}

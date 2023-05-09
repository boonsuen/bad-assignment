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
    getFarmDataList,
    getDistributionCenterDataList,
    getRetailerDataList,
    getConsumerDataList,
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
  const [farmDataList, setFarmDataList] = useState<any[]>([]);
  const [distributionCenterDataList, setDistributionCenterDataList] = useState<
    any[]
  >([]);
  const [retailerDataList, setRetailerDataList] = useState<any[]>([]);
  const [consumerDataList, setConsumerDataList] = useState<any[]>([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const contractOwnerAddress = await getContractOwner();
      setContractOwnerAddress(contractOwnerAddress);

      const adminAddresses = await getAdminList();
      setAdminAddresses(adminAddresses);

      const { farmDataList } = await getFarmDataList();
      setFarmDataList(farmDataList);

      const { distributionCenterDataList } =
        await getDistributionCenterDataList();
      setDistributionCenterDataList(distributionCenterDataList);

      const { retailerDataList } = await getRetailerDataList();
      setRetailerDataList(retailerDataList);

      const { consumerDataList } = await getConsumerDataList();
      setConsumerDataList(consumerDataList);

      setIsLoaded(true);
      toast.success('Accounts retrieved successfully!');
    } catch (error) {
      toast.error('Error retrieving accounts');
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
            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Admin Accounts
            </h2>
            <div className="relative overflow-x-auto">
              <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Account Address
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 flex items-center">
                      {contractOwnerAddress}
                      <span className="ml-2 whitespace-nowrap bg-blue-100 text-blue-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        Contract Owner
                      </span>
                    </td>
                  </tr>
                  {adminAddresses.map((address, index) => (
                    <tr
                      key={`${index}-${address}`}
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    >
                      <td className="px-6 py-4">{address}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Farm Accounts
            </h2>
            {farmDataList.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Farm ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Account Address
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Farm Name
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Farm Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {farmDataList.map((farmData, index) => (
                      <tr
                        key={`${index}-farm`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{farmData[0].toNumber()}</td>
                        <td className="px-6 py-4">{farmData[1]}</td>
                        <td className="px-6 py-4">{farmData[2]}</td>
                        <td className="px-6 py-4">{farmData[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no farm accounts yet.
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Distribution Center Accounts
            </h2>
            {distributionCenterDataList.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        DC ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Account Address
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        DC Name
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        DC Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {distributionCenterDataList.map((dcData, index) => (
                      <tr
                        key={`${index}-dc`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{dcData[0].toNumber()}</td>
                        <td className="px-6 py-4">{dcData[1]}</td>
                        <td className="px-6 py-4">{dcData[2]}</td>
                        <td className="px-6 py-4">{dcData[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no distribution center accounts yet.
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Retailer Accounts
            </h2>
            {retailerDataList.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Retailer ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Account Address
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Retailer Name
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Retailer Location
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {retailerDataList.map((rtData, index) => (
                      <tr
                        key={`${index}-retailer`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{rtData[0].toNumber()}</td>
                        <td className="px-6 py-4">{rtData[1]}</td>
                        <td className="px-6 py-4">{rtData[2]}</td>
                        <td className="px-6 py-4">{rtData[3]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no retailer accounts yet.
              </div>
            )}

            <h2 className="text-lg font-semibold text-slate-800 mt-8 mb-4">
              Consumer Accounts
            </h2>
            {consumerDataList.length > 0 ? (
              <div className="relative overflow-x-auto">
                <table className="border w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Consumer ID
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Account Address
                      </th>
                      <th scope="col" className="px-6 py-3 whitespace-nowrap">
                        Consumer Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {consumerDataList.map((cData, index) => (
                      <tr
                        key={`${index}-retailer`}
                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      >
                        <td className="px-6 py-4">{cData[0].toNumber()}</td>
                        <td className="px-6 py-4">{cData[1]}</td>
                        <td className="px-6 py-4">{cData[2]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mb-3 text-gray-500 dark:text-gray-400">
                There are no consumer accounts yet.
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { Rating } from '@/types';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ratings: Rating[] = ['Bad', 'Poor', 'Fair', 'Good', 'Excellent'];
const statuses: string[] = [
  'Harvested',
  'Arrived at Distribution Center',
  'Ariivated at Retailer',
  'Sold',
  'Rated',
];

export default function CheckDurianPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    checkDurianDetails,
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

  const [durianId, setDurianId] = useState<string>('');
  const [durianDetails, setDurianDetails] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkDurianDetails(Number(durianId)).then((durianDetails: any) => {
      setDurianDetails(durianDetails);
      if (durianDetails?.farmDetails[4] === '') {
        toast.error(`Durian with ID ${durianId} not found.`);
        setErrorMessage(`Durian with ID ${durianId} does not exist.`);
      }
    });
  };

  console.log('durianDetails', durianDetails);

  return (
    <Layout
      currentPage="/"
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
          {pages['/'].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="durian-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Durian ID
                </label>
                <input
                  type="number"
                  value={durianId}
                  onChange={(e) => {
                    setDurianId(e.target.value);
                  }}
                  id="durian-id"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Submit
            </button>
          </form>
        </div>

        {durianDetails !== null && durianDetails?.farmDetails[4] !== '' && (
          <>
            <div className="mt-8 text-sm font-medium mr-2 pr-2.5 py-0.5">
              Durian Status : {' '}
              <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                {statuses[durianDetails.status]}
              </span>
            </div>
            {durianDetails.farmDetails && (
              <table className="border w-full mt-4 text-sm text-left text-gray-500 dark:text-gray-400">
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
                    <td className="px-6 py-4">
                      {durianDetails.farmDetails[0].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Tree ID
                    </th>
                    <td className="px-6 py-4">
                      {durianDetails.farmDetails[1].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Variety Code
                    </th>
                    <td className="px-6 py-4">
                      {durianDetails.farmDetails[2]}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Harvested Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        durianDetails.farmDetails[3].toNumber() * 1000
                      ).toLocaleDateString()} ${new Date(
                        durianDetails.farmDetails[3].toNumber() * 1000
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}`}
                    </td>
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
                        src={durianDetails.farmDetails[4]}
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
                      {ratings[durianDetails.farmDetails[5]]}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {durianDetails.DCDetails && (
              <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '65%' }} />
                </colgroup>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Distribution Center Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Distribution Center ID
                    </th>
                    <td className="px-6 py-4">
                      {durianDetails.DCDetails[0].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Arrival Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        durianDetails.DCDetails[1].toNumber() * 1000
                      ).toLocaleDateString()} ${new Date(
                        durianDetails.DCDetails[1].toNumber() * 1000
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}`}
                    </td>
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
                        src={durianDetails.DCDetails[2]}
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
                      {ratings[durianDetails.DCDetails[3]]}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {durianDetails.RTDetails && (
              <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '65%' }} />
                </colgroup>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Retailer Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Retailer ID
                    </th>
                    <td className="px-6 py-4">
                      {durianDetails.RTDetails[0].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Arrival Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        durianDetails.RTDetails[1].toNumber() * 1000
                      ).toLocaleDateString()} ${new Date(
                        durianDetails.RTDetails[1].toNumber() * 1000
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}`}
                    </td>
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
                        src={durianDetails.RTDetails[2]}
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
                      {ratings[durianDetails.RTDetails[3]]}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {durianDetails.soldDetails && (
              <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '65%' }} />
                </colgroup>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Sold Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Consumer ID
                    </th>
                    <td className="px-6 py-4">
                      {durianDetails.soldDetails[0].toNumber()}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Sold Date & Time
                    </th>
                    <td className="px-6 py-4">
                      {`${new Date(
                        durianDetails.soldDetails[1].toNumber() * 1000
                      ).toLocaleDateString()} ${new Date(
                        durianDetails.soldDetails[1].toNumber() * 1000
                      ).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}`}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}

            {durianDetails.ratingDetails && (
              <table className="border w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
                <colgroup>
                  <col style={{ width: '35%' }} />
                  <col style={{ width: '65%' }} />
                </colgroup>
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" colSpan={2} className="px-6 py-3">
                      Rating Details
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Durian Image
                    </th>
                    <td className="px-6 py-4">
                      <img
                        src={durianDetails.ratingDetails[0]}
                        alt="Durian"
                        className="w-32 h-32 rounded-lg object-contain border"
                      />
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Taste
                    </th>
                    <td className="px-6 py-4">
                      {ratings[durianDetails.ratingDetails[1]]}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Fragrance
                    </th>
                    <td className="px-6 py-4">
                      {ratings[durianDetails.ratingDetails[2]]}
                    </td>
                  </tr>
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      Creaminess
                    </th>
                    <td className="px-6 py-4">
                      {ratings[durianDetails.ratingDetails[3]]}
                    </td>
                  </tr>
                </tbody>
              </table>
            )}
          </>
        )}

        {errorMessage !== '' && !(durianDetails !== null && durianDetails?.farmDetails[4] !== '') && (
          <div className="mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            <p className="text-red-500">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

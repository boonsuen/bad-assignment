import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { useContext, useEffect, useState } from 'react';

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    checkDurianDetails(Number(durianId)).then((durianDetails: any) => {
      setDurianDetails(durianDetails);
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
                  onChange={(e) => setDurianId(e.target.value)}
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

        {durianDetails !== null && (
          <table className="w-full mt-8 text-sm text-left text-gray-500 dark:text-gray-400">
            {durianDetails.farmDetails && (
              <>
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
                  <tr className="bg-white dark:bg-gray-800">
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
                </tbody>
              </>
            )}
          </table>
        )}
      </div>
    </Layout>
  );
}

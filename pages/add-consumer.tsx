import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '../context/Dtrace';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AddConsumerPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    addConsumer,
    getConsumerTotal,
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

  const [consumerAccountAddress, setConsumerAccountAddress] = useState('');
  const [consumerName, setConsumerName] = useState('');
  const [latestConsumerId, setLatestConsumerId] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (consumerAccountAddress === '') {
      toast.error('Please enter an account address');
      return;
    } else if (!/^0x[a-fA-F0-9]{40}$/.test(consumerAccountAddress)) {
      toast.error('Please enter a valid account address');
      return;
    } else if (consumerAccountAddress.toLowerCase() === currentAccount) {
      toast.error('You cannot add your own account');
      return;
    } else if (
      (await checkAccountType(consumerAccountAddress)) === 'Consumer'
    ) {
      toast.error('This account is already a consumer');
      return;
    } else {
      try {
        await addConsumer(consumerAccountAddress, consumerName);
        const newConsumerId = await getConsumerTotal();
        setLatestConsumerId(newConsumerId);
        toast.success('Consumer added successfully!');
      } catch (error) {
        toast.error('Error adding consumer');
      }
    }
  };

  return (
    <Layout
      currentPage="/add-consumer"
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
          {pages['/add-consumer'].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="row-start-1">
                <label
                  htmlFor="consumer-account-address"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Consumer Account Address
                </label>
                <input
                  type="text"
                  id="consumer-account-address"
                  value={consumerAccountAddress}
                  onChange={(e) => setConsumerAccountAddress(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                  required
                />
              </div>

              <div className="row-start-2">
                <label
                  htmlFor="consumer-name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Consumer Name
                </label>
                <input
                  type="text"
                  id="consumer-name"
                  value={consumerName}
                  onChange={(e) => setConsumerName(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. Wilson Chai Boon Xiang"
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
        {latestConsumerId !== null && (
          <div
            className="p-4 mt-6 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <span className="font-medium">Generated consumer ID:</span>{' '}
            {latestConsumerId}
          </div>
        )}
      </div>
    </Layout>
  );
}

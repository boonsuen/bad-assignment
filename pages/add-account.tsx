import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Roles = 'ADMIN' | 'FARM' | 'DISTRIBUTION_CENTER' | 'RETAILER' | 'CONSUMER';

export default function AddAccountPage() {
  // ---------------------------------------------------------------------//
  const [isLoading, setIsLoading] = useState(true);
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    addAdmin,
    addFarm,
    addDistributionCenter,
    addRetailer,
    addConsumer,
  } = useContext(DTraceContext);
  const [role, setRole] = useState<roles | null>(null);

  const router = useRouter();

  useEffect(() => {
    checkIfWalletIsConnected().then(async (res) => {
      if (!res) {
        router.push('/');
      }

      setIsLoading(false);
    });

    if (currentAccount) {
      console.log('currentAccount', currentAccount);

      checkAccountType(currentAccount).then((accountType) => {
        console.log(accountType);

        setRole(accountType as roles);
      });
    }
  }, [currentAccount]);
  console.log('role', role);

  // ---------------------------------------------------------------------//

  const [accountAddress, setAccountAddress] = useState('');
  const [accountType, setAccountType] = useState<Roles>('ADMIN');
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [distributionCenterName, setDistributionCenterName] = useState('');
  const [distributionCenterLocation, setDistributionCenterLocation] =
    useState('');
  const [retailerName, setRetailerName] = useState('');
  const [retailerLocation, setRetailerLocation] = useState('');
  const [consumerName, setConsumerName] = useState('');

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value as Roles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (accountType === 'ADMIN') {
        await addAdmin(accountAddress);
        toast.success('Admin successfully added!');
      } else if (accountType === 'FARM') {
        await addFarm(accountAddress, farmName, farmLocation);
        toast.success('Farm successfully added!');
      } else if (accountType === 'DISTRIBUTION_CENTER') {
        await addDistributionCenter(
          accountAddress,
          distributionCenterName,
          distributionCenterLocation
        );
        toast.success('Distribution center successfully added!');
      } else if (accountType === 'RETAILER') {
        await addRetailer(accountAddress, retailerName, retailerLocation);
        toast.success('Retailer successfully added!');
      } else if (accountType === 'CONSUMER') {
        await addConsumer(accountAddress, consumerName);
        toast.success('Consumer successfully added!');
      }
    } catch (error) {
      toast.error('Error adding account');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen">
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (currentAccount && role !== null) {
    return (
      <Layout
        currentPage="/add-account"
        currentRole={
          (role.toLowerCase() === 'owneroradmin'
            ? 'admin'
            : role.toLowerCase()) as roles
        }
      >
        <div className="p-4 md:ml-64">
          <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
            {pages['/add-account'].title}
          </h1>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-6 mb-6 md:grid-cols-2">
                <div className="col-span-1 grid gap-6">
                  <div>
                    <label
                      htmlFor="account-address"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Account Address
                    </label>
                    <input
                      type="text"
                      id="account-address"
                      value={accountAddress}
                      onChange={(e) => setAccountAddress(e.target.value)}
                      className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                      placeholder="e.g. 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="account-type"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Account Type
                    </label>
                    <select
                      id="account-type"
                      className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                      value={accountType}
                      onChange={handleAccountTypeChange}
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="FARM">Farm</option>
                      <option value="DISTRIBUTION_CENTER">
                        Distribution Center
                      </option>
                      <option value="RETAILER">Retailer</option>
                      <option value="CONSUMER">Consumer</option>
                    </select>
                  </div>

                  {accountType === 'FARM' && (
                    <>
                      <div>
                        <label
                          htmlFor="farm-name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Farm Name
                        </label>
                        <input
                          type="text"
                          id="farm-name"
                          value={farmName}
                          onChange={(e) => setFarmName(e.target.value)}
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. Happy Farm"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="farm-location"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Farm Location
                        </label>
                        <input
                          type="text"
                          id="farm-location"
                          value={farmLocation}
                          onChange={(e) => setFarmLocation(e.target.value)}
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. Pusat Pertanian Pontian, Johor"
                          required
                        />
                      </div>
                    </>
                  )}

                  {accountType === 'DISTRIBUTION_CENTER' && (
                    <>
                      <div>
                        <label
                          htmlFor="distribution-center-name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Distribution Center Name
                        </label>
                        <input
                          type="text"
                          id="distribution-center-name"
                          value={distributionCenterName}
                          onChange={(e) =>
                            setDistributionCenterName(e.target.value)
                          }
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. Happy Distribution Center"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="distribution-center-location"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Distribution Center Location
                        </label>
                        <input
                          type="text"
                          id="distribution-center-location"
                          value={distributionCenterLocation}
                          onChange={(e) =>
                            setDistributionCenterLocation(e.target.value)
                          }
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. Taman Industri Jaya, Johor"
                          required
                        />
                      </div>
                    </>
                  )}

                  {accountType === 'RETAILER' && (
                    <>
                      <div>
                        <label
                          htmlFor="retailer-name"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Retailer Name
                        </label>
                        <input
                          type="text"
                          id="retailer-name"
                          value={retailerName}
                          onChange={(e) => setRetailerName(e.target.value)}
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. Happy Durian Shop"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="retailer-location"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Retailer Location
                        </label>
                        <input
                          type="text"
                          id="retailer-location"
                          value={retailerLocation}
                          onChange={(e) => setRetailerLocation(e.target.value)}
                          className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                          placeholder="e.g. PT1967, Jalan SS 2/61, SS 2, 47300 PJ"
                          required
                        />
                      </div>
                    </>
                  )}

                  {accountType === 'CONSUMER' && (
                    <div>
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
                        placeholder="e.g. Jonathan Tan Wei Suen"
                        required
                      />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
              >
                Register
              </button>
            </form>
          </div>
        </div>
      </Layout>
    );
  }
}

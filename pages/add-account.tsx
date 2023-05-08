import Layout, { pages } from '@/components/layout/Layout';
import { fetchContract } from '@/context/Dtrace';
import { ethers } from 'ethers';
import { useState } from 'react';
import Web3Modal from 'web3modal';

type roles = 'ADMIN' | 'FARM' | 'DISTRIBUTION_CENTER' | 'RETAILER' | 'CONSUMER';

export default function AddAccountPage() {
  const [accountAddress, setAccountAddress] = useState('');
  const [accountType, setAccountType] = useState<roles>('ADMIN');
  const [farmName, setFarmName] = useState('');
  const [farmLocation, setFarmLocation] = useState('');
  const [distributionCenterName, setDistributionCenterName] = useState('');
  const [distributionCenterLocation, setDistributionCenterLocation] =
    useState('');
  const [retailerName, setRetailerName] = useState('');
  const [retailerLocation, setRetailerLocation] = useState('');
  const [consumerName, setConsumerName] = useState('');

  const handleAccountTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAccountType(e.target.value as roles);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    if (accountType === 'ADMIN') {
      await contract.addAdmin(accountAddress);
    } else if (accountType === 'FARM') {
      await contract.addFarm(accountAddress, farmName, farmLocation);
    } else if (accountType === 'RETAILER') {
      await contract.addRetailer(
        accountAddress,
        retailerName,
        retailerLocation
      );
    } else if (accountType === 'DISTRIBUTION_CENTER') {
      await contract.addRetailer(
        accountAddress,
        retailerName,
        retailerLocation
      );
    }
  };

  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/add-account" currentRole="admin">
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

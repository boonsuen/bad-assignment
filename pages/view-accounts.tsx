import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Roles = 'ADMIN' | 'FARM' | 'DISTRIBUTION_CENTER' | 'RETAILER' | 'CONSUMER';

export default function ViewAccountPage() {
  // ---------------------------------------------------------------------//
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
        toast.success('Admin added successfully!');
      } else if (accountType === 'FARM') {
        await addFarm(accountAddress, farmName, farmLocation);
        toast.success('Farm added successfully!');
      } else if (accountType === 'DISTRIBUTION_CENTER') {
        await addDistributionCenter(
          accountAddress,
          distributionCenterName,
          distributionCenterLocation
        );
        toast.success('Distribution center added successfully!');
      } else if (accountType === 'RETAILER') {
        await addRetailer(accountAddress, retailerName, retailerLocation);
        toast.success('Retailer added successfully!');
      } else if (accountType === 'CONSUMER') {
        await addConsumer(accountAddress, consumerName);
        toast.success('Consumer added successfully!');
      }
    } catch (error) {
      toast.error('Error adding account');
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
      </div>
    </Layout>
  );
}

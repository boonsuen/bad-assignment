import Layout, { pages } from '@/components/layout/Layout';
import { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

export default function AddDurianPage() {
  const [varietyCode, setVarietyCode] = useState('');
  const [farmId, setFarmId] = useState('');
  const [treeId, setTreeId] = useState('');
  const [harvestedDate, setHarvestedDate] = useState({
    startDate: null,
    endDate: null,
  });
  const [harvestedTime, setHarvestedTime] = useState(
    new Date().toLocaleTimeString('en-US', { hour12: false })
  );

  const handleHarvestedDateChange = (date: any) => {
    console.log('harvestedDate: ', date);
    setHarvestedDate(date);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission date', {
      varietyCode,
      farmId,
      treeId,
      harvestedDate,
      harvestedTime,
    });
  };

  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/add-durian" currentRole="farmer">
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/add-durian'].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div>
                <label
                  htmlFor="variety-code"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Variety Code
                </label>
                <input
                  type="text"
                  id="variety-code"
                  value={varietyCode}
                  onChange={(e) => setVarietyCode(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. D24"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="farm-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Farm ID
                </label>
                <input
                  type="text"
                  id="farm-id"
                  value={farmId}
                  onChange={(e) => setFarmId(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="tree-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Tree ID
                </label>
                <input
                  type="text"
                  id="tree-id"
                  value={treeId}
                  onChange={(e) => setTreeId(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="harvested-date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Harvested Date
                </label>
                <Datepicker
                  primaryColor="green"
                  asSingle={true}
                  value={harvestedDate}
                  onChange={handleHarvestedDateChange}
                />
              </div>
              <div>
                <label
                  htmlFor="harvested-time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Harvested Time
                </label>
                <input
                  type="time"
                  step={1}
                  id="harvested-time"
                  value={harvestedTime}
                  onChange={(e) => setHarvestedTime(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Add New Durian
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

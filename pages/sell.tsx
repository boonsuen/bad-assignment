import Layout, { pages } from '@/components/layout/Layout';
import { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';

export default function SellDurianPage() {
  const [durianId, setDurianId] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [soldDate, setSoldDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [soldTime, setSoldTime] = useState(
    `${String(new Date().getHours()).padStart(2, '0')}:${String(
      new Date().getMinutes()
    ).padStart(2, '0')}`
  );

  const handleSoldDateChange = (date: any) => {
    console.log('arrivalDate: ', date);
    setSoldDate(date);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission date', {
      durianId,
      consumerId,
    });
  };

  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/sell" currentRole="retailer">
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/sell'].title}
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
                  type="text"
                  id="durian-id"
                  value={durianId}
                  onChange={(e) => setDurianId(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="consumer-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Consumer ID
                </label>
                <input
                  type="text"
                  id="consumer-id"
                  value={consumerId}
                  onChange={(e) => setConsumerId(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
              <label
                htmlFor="sold-date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sold Date
              </label>
              <Datepicker
                primaryColor="green"
                asSingle={true}
                value={soldDate}
                onChange={handleSoldDateChange}
              />
            </div>

            <div>
              <label
                htmlFor="sold-time"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sold Time
              </label>
              <input
                type="time"
                id="harvested-time"
                value={soldTime}
                onChange={(e) => setSoldTime(e.target.value)}
                className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                required
              />
              </div>
            </div>

            <button
              type="submit"
              className="text-white rounded-lg bg-primary focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:focus:ring-blue-800"
            >
              Update Durian
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

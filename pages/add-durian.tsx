import Layout, { pages } from '@/components/layout/Layout';
import { useState } from 'react';
import Datepicker from 'react-tailwindcss-datepicker';
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

export default function AddDurianPage() {
  const [value, setValue] = useState({
    startDate: null,
    endDate: null,
  });

  const handleValueChange = (newValue: any) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };
  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/add-durian" currentRole="farmer">
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/add-durian'].title}
        </h1>
        <div>
          <form>
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
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="D1"
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
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="F1"
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
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="T1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="distribution-date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Distribution Date
                </label>
                <Datepicker              
                  primaryColor="green"
                  asSingle={true}
                  value={value}
                  onChange={handleValueChange}
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

import Layout, { pages } from '@/components/layout/Layout';
import { useState } from 'react';

export default function CheckDurianPage() {
  const [durianId, setDurianId] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submission data', { durianId });
  };

  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/check" currentRole="guest">
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/check'].title}
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
                  value={durianId}
                  onChange={(e) => setDurianId(e.target.value)}
                  id="durian-id"
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="123"
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
      </div>
    </Layout>
  );
}

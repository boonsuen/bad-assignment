import Layout, { pages } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { Rating } from '@/types';
import { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Datepicker from 'react-tailwindcss-datepicker';

export default function StockInDurianPage() {
  const [durianId, setDurianId] = useState('');
  const [retailerId, setRetailerId] = useState('');
  const [arrivalDate, setArrivalDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [arrivalTime, setArrivalTime] = useState(
    `${String(new Date().getHours()).padStart(2, '0')}:${String(
      new Date().getMinutes()
    ).padStart(2, '0')}`
  );
  const [condition, setCondition] = useState<Rating>('Excellent');
  const [fileUrl, setFileUrl] = useState<string>();

  const handleArrivalDateChange = (date: any) => {
    console.log('arrivalDate: ', date);
    setArrivalDate(date);
  };

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCondition(e.target.value as Rating);
  };

  const { uploadToIPFS } = useContext(DTraceContext);

  const onDrop = useCallback(async (acceptedFiles: any[]) => {
    const url = await uploadToIPFS(acceptedFiles[0]);
    setFileUrl(url);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxSize: 5000000,
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileUrl) {
      alert('Please upload an image of the durian');
      return;
    }

    console.log('Form submission data', {
      durianId,
      retailerId,
      arrivalDate,
      arrivalTime,
      condition,
      fileUrl,
    });
  };

  return (
    // TODO: Current role will be dynamically determined and passed in
    <Layout currentPage="/stock-in" currentRole="retailer">
      <div className="p-4 md:ml-64">
        <h1 className="text-2xl font-semibold text-slate-800 mt-3 mb-5">
          {pages['/stock-in'].title}
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
                  htmlFor="retailer-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Retailer ID
                </label>
                <input
                  type="text"
                  id="retailer-id"
                  value={retailerId}
                  onChange={(e) => setRetailerId(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="arrival-date"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Arrival Date
                </label>
                <Datepicker
                  primaryColor="green"
                  asSingle={true}
                  value={arrivalDate}
                  onChange={handleArrivalDateChange}
                />
              </div>
              <div>
                <label
                  htmlFor="arrival-time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Arrival Time
                </label>
                <input
                  type="time"
                  id="harvested-time"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="condition"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Condition
                </label>
                <select
                  id="condition"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  value={condition}
                  onChange={handleConditionChange}
                >
                  <option value="Bad">Bad</option>
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Durian Image
                </label>
                <div
                  className="flex cursor-pointer justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                  {...getRootProps()}
                >
                  <input {...getInputProps()} />
                  <div>
                    <div>
                      {fileUrl ? (
                        <img
                          src={fileUrl}
                          className="mx-auto mb-3 h-[100px] w-[100px] object-contain border text-gray-400"
                        />
                      ) : (
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 12h-4a8 8 0 00-8 8v12a8 8 0 008 8h16a8 8 0 008-8V20a8 8 0 00-8-8h-4"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 20h4l2 2 4-4 4 4 2-2h4"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="rounded-md font-medium text-green-600 hover:text-green-500">
                          Upload a file
                        </span>{' '}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, GIF, WEBM up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
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

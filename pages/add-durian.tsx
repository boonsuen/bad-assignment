import Layout, { pages } from '@/components/layout/Layout';
import { DTraceContext } from '@/context/Dtrace';
import { useCallback, useContext, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Datepicker from 'react-tailwindcss-datepicker';

export default function AddDurianPage() {
  const [varietyCode, setVarietyCode] = useState('');
  const [farmId, setFarmId] = useState('');
  const [treeId, setTreeId] = useState('');
  const [harvestedDate, setHarvestedDate] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [harvestedTime, setHarvestedTime] = useState(
    `${String(new Date().getHours()).padStart(2, '0')}:${String(
      new Date().getMinutes()
    ).padStart(2, '0')}`
  );
  const [fileUrl, setFileUrl] = useState<string>();

  const handleHarvestedDateChange = (date: any) => {
    console.log('harvestedDate: ', date);
    setHarvestedDate(date);
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
    console.log('Form submission date', {
      varietyCode,
      farmId,
      treeId,
      harvestedDate,
      harvestedTime,
      fileUrl,
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
                  id="harvested-time"
                  value={harvestedTime}
                  onChange={(e) => setHarvestedTime(e.target.value)}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  required
                />
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="harvested-time"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Durian Image
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <img src={fileUrl} alt="Voter Image" />
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
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div {...getRootProps()}>
                  <input {...getInputProps()} />

                  <div>
                    <p>Upload File: JPG, PNG, GIF, WEBM Max 10MB</p>
                    <div>
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
                    </div>
                    <p>Drag & Drop File</p>
                    <p>or Browse Media on your device</p>
                  </div>
                </div>
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

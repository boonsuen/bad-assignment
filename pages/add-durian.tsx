import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '../context/Dtrace';
import { useRouter } from 'next/router';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Rating } from '@/types';
import { useDropzone } from 'react-dropzone';
import Datepicker from 'react-tailwindcss-datepicker';
import { getUnixTime } from 'date-fns';

export default function AddDurianPage() {
  // ---------------------------------------------------------------------//
  const [isLoading, setIsLoading] = useState(true);
  const { currentAccount, checkIfWalletIsConnected, checkAccountType, addDurian } =
    useContext(DTraceContext);
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

  const [varietyCode, setVarietyCode] = useState('');
  const [farmId, setFarmId] = useState<number>();
  const [treeId, setTreeId] = useState<number>();
  const [condition, setCondition] = useState<Rating>('Excellent');
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

  const handleConditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCondition(e.target.value as Rating);
  };

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

    if (!fileUrl) {
      alert('Please upload an image of the durian');
      return;
    }

    console.log('Form submission data', {
      varietyCode,
      farmId,
      treeId,
      harvestedDate,
      harvestedTime,
      fileUrl,
    });

    const combinedDate = new Date(
      harvestedDate.startDate.getFullYear(),
      harvestedDate.startDate.getMonth(),
      harvestedDate.startDate.getDate(),
      parseInt(harvestedTime.split(':')[0], 10),
      parseInt(harvestedTime.split(':')[1], 10)
    );

    const unixHarvestedTime = getUnixTime(combinedDate);

    let conditionFarm:number; 

    switch(condition){
      case 'Excellent':
        conditionFarm = 4;
        break;
      case 'Good':
        conditionFarm = 3;
        break;
      case 'Fair':
        conditionFarm = 2;
        break;
      case 'Poor':
        conditionFarm = 1;
        break;
      case 'Bad':
        conditionFarm = 0;
        break;
      default:
        conditionFarm = 0;
        break;
    }

    addDurian(
      farmId as number,
      treeId as number,
      varietyCode,
      unixHarvestedTime,
      fileUrl,
      conditionFarm
    )
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
                  type="number"
                  id="farm-id"
                  value={farmId}
                  onChange={(e) => setFarmId(parseInt(e.target.value))}
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
                  onChange={(e) => setTreeId(parseInt(e.target.value))}
                  className="relative transition-all duration-300 py-2.5 pl-4 pr-14 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
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
              Add New Durian
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
}

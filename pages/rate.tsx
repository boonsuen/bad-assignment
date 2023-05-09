import Layout, { pages, roles } from '@/components/layout/Layout';
import { DTraceContext } from '../context/Dtrace';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Rating } from '@/types';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';

export default function AddConsumerPage() {
  // ---------------------------------------------------------------------//
  const {
    currentAccount,
    checkIfWalletIsConnected,
    checkAccountType,
    rateDurian,
    checkRatingStatus,
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

  const [durianId, setDurianId] = useState<number>();
  const [taste, setTaste] = useState<Rating>('Excellent');
  const [fragrance, setFragrance] = useState<Rating>('Excellent');
  const [creaminess, setCreaminess] = useState<Rating>('Excellent');
  const [fileUrl, setFileUrl] = useState<string>();

  const handleTasteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTaste(e.target.value as Rating);
  };
  const handleFragranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFragrance(e.target.value as Rating);
  };
  const handleCreaminessChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCreaminess(e.target.value as Rating);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!fileUrl) {
      alert('Please upload an image of the durian');
      return;
    }

    console.log('Form submission data', {
      durianId,
      taste,
      fragrance,
      creaminess,
      fileUrl,
    });

    const tasteNum = await checkRatingStatus(taste);
    const fragranceNum = await checkRatingStatus(fragrance);
    const creaminessNum = await checkRatingStatus(creaminess);

    try {
      await rateDurian(
        durianId as number,
        fileUrl,
        tasteNum,
        fragranceNum,
        creaminessNum
      );
      toast.success("Durian rated successfully!");
    } catch (error) {
      toast.error('Error adding durian');
    }
  };

  return (
    <Layout
      currentPage="/rate"
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
          {pages['/rate'].title}
        </h1>
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6 mb-6 md:grid-cols-2">
              <div className="row-start-1">
                <label
                  htmlFor="durian-id"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Durian ID
                </label>
                <input
                  type="number"
                  id="durian-id"
                  value={durianId}
                  onChange={(e) => setDurianId(parseInt(e.target.value))}
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div className="row-start-2">
                <label
                  htmlFor="taste"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Taste
                </label>
                <select
                  id="taste"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  value={taste}
                  onChange={handleTasteChange}
                >
                  <option value="Bad">Bad</option>
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div className="row-start-3">
                <label
                  htmlFor="fragrance"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Fragrance
                </label>
                <select
                  id="fragrance"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  value={fragrance}
                  onChange={handleFragranceChange}
                >
                  <option value="Bad">Bad</option>
                  <option value="Poor">Poor</option>
                  <option value="Fair">Fair</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>

              <div className="row-start-4">
                <label
                  htmlFor="creaminess"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Creaminess
                </label>
                <select
                  id="creaminess"
                  className="relative transition-all duration-300 py-2.5 px-4 w-full border-gray-300 dark:bg-slate-800 dark:text-white/80 dark:border-slate-600 rounded-lg tracking-wide font-light text-sm placeholder-gray-400 bg-white focus:ring disabled:opacity-40 disabled:cursor-not-allowed focus:border-green-500 focus:ring-green-500/20"
                  value={creaminess}
                  onChange={handleCreaminessChange}
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
                          className="mx-auto mb-3 h-32 w-32 object-contain border text-gray-400"
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
              Rate Durian
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}

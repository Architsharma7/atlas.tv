import { useCreateAsset } from "@livepeer/react";
import { useMemo } from "react";
import { useCallback, useState, createRef } from "react";
import { useDropzone } from "react-dropzone";
import { Player, useAssetMetrics } from "@livepeer/react";
import { Web3Storage } from "web3.storage";

function getAccessToken() {
  return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
}

function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() });
}

export const CreateAndViewAsset = ({
  title,
  desc,
  setDesc,
  setTitle,
  setPostVideoUrl,
  setPostVideoCover,
  postVideoUrl,
  postVideoCover,
  setLivepeerLink,
  livepeerLink,
}) => {
  const [video, setVideo] = useState<File | undefined>();
  const {
    mutate: createAsset,
    data: asset,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
          // sources: [{ name: video.name, file: video, creatorId: "" }] as const,
          /// to upload directly to ipfs do this /////
          sources: [
            {
              name: video.name,
              file: video,
              storage: {
                ipfs: true,
                metadata: {
                  name: "video",
                  description: "desc",
                },
              },
            },
          ] as const,
        }
      : null
  );

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0 && acceptedFiles?.[0]) {
      setVideo(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "video/*": ["*.mp4"],
    },
    maxFiles: 1,
    onDrop,
  });

  const setVideoIpfsHash = () => {
    {
      asset?.[0].hash && setPostVideoUrl(asset?.[0].storage?.ipfs?.url);
      console.log(postVideoUrl);
    }
  };

  const storeLivepeerPlaybackId = () => {
    asset?.[0].playbackId && setLivepeerLink(asset?.[0].playbackId);
    console.log(livepeerLink);
  };

  const livepeerUpload = () => {
    setVideoIpfsHash();
    storeLivepeerPlaybackId();
    // if (postVideoUrl && livepeerLink) {
    //   alert("Data Stored and ready to post");
    // }
  };

  const progressFormatted = useMemo(
    () =>
      progress?.[0].phase === "failed"
        ? "Failed to process video."
        : progress?.[0].phase === "waiting"
        ? "Waiting"
        : progress?.[0].phase === "uploading"
        ? `Uploading: ${Math.round(progress?.[0]?.progress * 100)}%`
        : progress?.[0].phase === "processing"
        ? `Processing: ${Math.round(progress?.[0].progress * 100)}%`
        : null,
    [progress]
  );

  // const { data: metrics } = useAssetMetrics({
  //   assetId: asset?.[0].id,
  //   refetchInterval: 30000,
  // });

  const isLoading = useMemo(
    () =>
      status === "loading" ||
      (asset?.[0] && asset[0].status?.phase !== "ready"),
    [status, asset]
  );

  const fileInputRef = createRef();

  async function storeFiles(image: any) {
    const client = makeStorageClient();
    const cid = await client.put([image], {
      wrapWithDirectory: false,
    });
    console.log("stored files with cid:", cid);
    setPostVideoCover(cid);
  }

  return (
    <>
      <div className="w-screen">
        {/* {!asset && ( */}
        <div className="flex flex-col">
          <div className="w-5/6 flex justify-center mx-auto h-2/3">
            <div className="w-1/2 border-dashed border-2 border-black flex flex-col justify-center mx-8 rounded-xl">
              <div>
                {asset?.[0]?.playbackId ? (
                  <Player
                    title={asset[0].name}
                    playbackId={asset[0].playbackId}
                  />
                ) : (
                  <div {...getRootProps()} className="">
                    <input {...getInputProps()} className="w-full h-full" />
                    <div className="flex flex-col h-full justify-center items-center m-auto">
                      <div>
                        {video ? (
                          <p>{video.name}</p>
                        ) : (
                          <p>Drag and drop or browse files</p>
                        )}
                        {error?.message && <p>{error.message}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="w-1/2 mx-8">
              <div className="flex flex-col">
                <div>
                  <p className="font-semibold text-xl">Title</p>
                  <input
                    type="text"
                    className="w-full bg-white border border-black px-3 py-1 rounded-lg text-black mt-2"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div>
                  <p className="font-semibold text-xl mt-10">Description</p>
                  <textarea
                    value={desc}
                    onChange={(e) => setDesc(e.target.value)}
                    className="w-full bg-white border border-black px-3 py-1 rounded-lg text-black mt-2 h-40"
                  />
                </div>
                <div className="mt-4">
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="w-full bg-white border-2 border-dashed border-black px-3 py-1 rounded-lg text-black mt-2 h-40 cursor-pointer flex justify-center items-center"
                  >
                    {postVideoCover ? (
                      <p>Image(0)</p>
                    ) : (
                      <p>select Cover Image</p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={(e) => setPostVideoCover(e.target.files[0])}
                    hidden
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10 w-5/6 flex justify-center mx-auto">
            {progressFormatted ? (
              <button
                className="bg-white text-green-500 font-semibold text-xl border border-green-500 rounded-lg px-10 py-2"
                disabled={true}
              >
                {progressFormatted}
              </button>
            ) : (
              <div>
                {asset?.[0].playbackId ? (
                  <button
                    onClick={() => livepeerUpload()}
                    className="bg-white text-green-500 font-semibold text-xl border border-green-500 rounded-lg px-10 py-2 hover:scale-105 hover:bg-green-500 hover:text-white duration-200 "
                  >
                    Proceed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      createAsset?.();
                      storeFiles(postVideoCover);
                    }}
                    disabled={isLoading || !createAsset}
                    className="bg-white text-green-500 font-semibold text-xl border border-green-500 rounded-lg px-10 py-2 hover:scale-105 hover:bg-green-500 hover:text-white duration-200 "
                  >
                    Upload
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

{
  /* {asset?.[0]?.playbackId && (
          <Player title={asset[0].name} playbackId={asset[0].playbackId} />
        )} */
}

{
  /* <div>
          {metrics?.metrics?.[0] && (
            <p>Views: {metrics?.metrics?.[0]?.startViews}</p>
          )}
        </div> */
}

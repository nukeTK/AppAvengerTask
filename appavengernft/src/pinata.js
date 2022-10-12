import axios from "axios";
const API_KEY = process.env.REACT_APP_PINATA_KEY;
const API_SECRETKEY = process.env.REACT_APP_PINATA_SECRET;

//Upload the Json to IPFS
export const uploadJSONToIPFS = async (JSONBody) => {
  try {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const res = await axios.post(url, JSONBody, {
      headers: {
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRETKEY,
      },
    });
    if (res) {
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

//uplaod the file to IPFS
export const uploadFileToIPFS = async (file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  let data = new FormData();
  data.append("file", file);
  const metadata = JSON.stringify({
    name: "testname",
    keyvalues: {
      exampleKey: "exampleValue",
    },
  });
  data.append("pinataMetadata", metadata);
  //Default Metadata recommended by the Pinata cloud to append with file //Start
  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: "FRA1",
          desiredReplicationCount: 1,
        },
        {
          id: "NYC1",
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append("pinataOptions", pinataOptions);
  //End
  try {
    const res = await axios.post(url, data, {
      maxBodyLength: "Infinity",
      headers: {
        "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
        pinata_api_key: API_KEY,
        pinata_secret_api_key: API_SECRETKEY,
      },
    });
    if (res) {
      return {
        success: true,
        pinataURL: "https://gateway.pinata.cloud/ipfs/" + res.data.IpfsHash,
      };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

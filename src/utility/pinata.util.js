import pinataSdk from '@pinata/sdk';

const pinata = new pinataSdk(
  '3d249b23773453b900ec',
  '6522179d86651c5c2644060d08a402172401342f74470f994188fb205f29036e'
);
export const uploadMetadataToIpfs = async (body) => {
  return await pinata
    .pinJSONToIPFS(body)
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      throw new Error('IPFS Metadata Upload failed');
    });
};

export const uploadImageToIpfs = async (data, name) => {
  return await pinata
    .pinFileToIPFS(data, {
      pinataMetadata: {
        name,
      },
    })
    .then((result) => {
      return result;
    })
    .catch((err) => {
      console.log(err);
      throw new Error('IPFS Image Upload failed');
    });
};

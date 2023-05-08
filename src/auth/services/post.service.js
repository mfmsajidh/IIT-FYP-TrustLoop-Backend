import User from '../schemas/auth.schema.js';
import { getToken } from '../../utility/utils.js';
import Post from '../schemas/post.schema.js';
import PostSchema from '../schemas/post.schema.js';
import fs from 'node:fs';
import path from 'node:path';
import StellarSdk from 'stellar-sdk';
import { pin } from 'nodemon/lib/version.js';
import {
  uploadImageToIpfs,
  uploadMetadataToIpfs,
} from '../../utility/pinata.util.js';
import { storeHashOnStellar } from '../../utility/stellar.util.js';
import mongoose from 'mongoose';
import axios from 'axios';

// Function to get the latest transactionId for a specific post
const getLatestTransactionForPost = async (postId) => {
  // const result = await Post.aggregate([
  //   { $match: { _id: postId } },
  //   { $unwind: '$transactionHistory' },
  //   { $sort: { 'transactionHistory.timestamp': -1 } },
  //   {
  //     $group: {
  //       _id: '$_id',
  //       latestTransactionId: {
  //         $first: '$transactionHistory.stellarTransactionId',
  //       },
  //     },
  //   },
  // ]);
  // console.log('result', result);
  // return result[0]?.latestTransactionId;

  const post = await Post.findById(postId);
  return post.transactionHistory
    .sort((a, b) => b.timestamp - a.timestamp) // Sort by timestamp in descending order
    .shift(); // Get the first item in the sorted array
};

export const addPostService = async (req) => {
  try {
    const {
      condition,
      category,
      postTitle,
      serialNumber,
      price,
      value,
      userId,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }

    const image = {
      data: fs.readFileSync(req.file.path),
      contentType: 'image/png',
    };

    if (
      !condition ||
      !category ||
      !postTitle ||
      !serialNumber ||
      !price ||
      !value ||
      !userId
    ) {
      throw new Error('Invalid fields');
    }

    const post = await Post.findOne({ serialNumber });
    if (post) {
      throw new Error('Post Exist');
    }

    const { IpfsHash: imageIpfsHash } = await uploadImageToIpfs(
      fs.createReadStream(req.file.path),
      `${req.file.filename}${req.file.originalname.substring(
        req.file.originalname.lastIndexOf('.')
      )}`
    );

    const { IpfsHash } = await uploadMetadataToIpfs({
      serialNumber,
      image: `https://gateway.pinata.cloud/ipfs/${imageIpfsHash}`,
      condition,
      category,
      value,
      userId,
    });

    const timestamp = new Date().toISOString();
    const currentStellarTransactionKey = `TrustLoop_${serialNumber}_${timestamp}`;

    const transaction = await storeHashOnStellar(
      IpfsHash,
      user.secret,
      currentStellarTransactionKey
    );

    return await PostSchema.create({
      image,
      condition,
      category,
      postTitle,
      serialNumber,
      price,
      value,
      userId,
      transactionHistory: [
        {
          stellarUserPublicKey: user.publicKey,
          stellarTransactionId: transaction.hash,
          ipfsHash: IpfsHash,
          timestamp: timestamp,
          transactionType: 'addPost',
        },
      ],
    });
  } catch (error) {
    throw new Error('Post creation failed');
  }
};

export const getAllPostsService = async () => {
  try {
    return await Post.find({ traded: false });
  } catch (error) {
    throw new Error('Get all posts failed');
  }
};

export const purchasePostService = async (req) => {
  try {
    const { postId, userId } = req.body;

    const post = await Post.findById(postId);
    if (!post) {
      throw new Error('Post does not exist');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User does not exist');
    }

    const latestTransaction = await getLatestTransactionForPost(post._id);

    const response = await axios.get(
      `https://gateway.pinata.cloud/ipfs/${latestTransaction.ipfsHash}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const timestamp = new Date().toISOString();
    const currentStellarTransactionKey = `TrustLoop_${post.serialNumber}_${timestamp}`;

    const { IpfsHash } = await uploadMetadataToIpfs({
      serialNumber: post.serialNumber,
      image: response.data.image,
      condition: post.condition,
      category: post.category,
      value: post.value,
      userId,
    });

    const transaction = await storeHashOnStellar(
      IpfsHash,
      user.secret,
      currentStellarTransactionKey
    );

    post.traded = true;
    post.userId = user._id;
    post.transactionHistory.push({
      stellarUserPublicKey: user.publicKey,
      previousStellarTransactionId: latestTransaction.stellarTransactionId,
      stellarTransactionId: transaction.hash,
      ipfsHash: IpfsHash,
      timestamp,
      transactionType: 'purchasePost',
    });

    return await post.save();
  } catch (error) {
    throw new Error('Purchase posts failed');
  }
};

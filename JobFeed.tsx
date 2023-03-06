import React, { useState, useEffect } from 'react';
import styles from './JobFeed.module.css';
import axios from 'axios';
import moment from 'moment';

// GET API = `https://hacker-news.firebaseio.com/v0/jobstories.json`;
// Metadata GET API = https://hacker-news.firebaseio.com/v0/item/YOUR_POST_ID_HERE.json`
const JobFeed = () => {
  const HACKERNEWS_POSTID_API = `https://hacker-news.firebaseio.com/v0/jobstories.json`;
  const [posts, setPosts] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [endReached, setEndReached] = useState(false);

  useEffect(() => {
    fetchAllJobIds();
  }, [pageNumber]);

  // Fetch all job ids and splice the data into pages
  const fetchAllJobIds = async () => {
    if (!endReached) {
      const response = await axios.get(HACKERNEWS_POSTID_API);
      const postIds = response.data.splice(pageNumber * perPage, perPage);
      console.log(postIds);

      if (posts.length >= response.data.length) {
        setEndReached(true);
      }
      fetchAllMetadata(postIds);
    }
  };

  const fetchAllMetadata = (postIds: [number]) => {
    postIds.forEach((postId) => {
      axios
        .get(`https://hacker-news.firebaseio.com/v0/item/${postId}.json`)
        .then((res) => {
          setPosts((posts) => [...posts, res.data]);
        })
        .catch((err) => console.log(err));
    });
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Hackernews Jobs</h1>
      <div className={styles.allPostsContainer}>
        {posts.map((singlePost) => (
          <Post key={singlePost.id} post={singlePost} />
        ))}
      </div>
      {!endReached && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={() => setPageNumber(pageNumber + 1)}
            className={styles.button}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

const Post = ({ post }) => {
  return (
    <a href={post?.url} target="__blank" style={{ textDecoration: 'none' }}>
      <div className={styles.postContainer}>
        <p>
          ID: <span>{post?.id}</span>{' '}
        </p>
        <h1>{post?.title}</h1>
        <p>{moment(post?.time).format('Do MMM YYYY hh:mm a')}</p>
        <p>
          Posted by: <span>{post?.by}</span>{' '}
        </p>
      </div>
    </a>
  );
};

export default JobFeed;

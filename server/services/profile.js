const MYSQL = require('../db/mysql/connection.js');
const { Post, PostList } = require('../models/post.js');
const { convertObjectArrayToArray } = require('./search.js');

const getProfileData = async (__handle) => {
  try {
    const [[userInformation]] = await MYSQL.connection.query(`SELECT * FROM TERRABUZZ.UserInformation WHERE Handle='${__handle}'`);

    delete userInformation.Password;

    const [[connections]] = await MYSQL.connection.query(`SELECT COUNT(*) AS totalConnections FROM TERRABUZZ.Connection WHERE Connection.Followers='${__handle}'`);

    let [interests] = await MYSQL.connection.query(`SELECT Topic FROM TERRABUZZ.Interest WHERE Handle='${__handle}'`);

    interests = convertObjectArrayToArray(interests, 'Topic');

    const { payload: posts } = await PostList.findById(__handle).populate('payload');
    posts.reverse();

    for (let i = 0; i < posts.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const { likes } = await Post.findById(posts[i]._id, { likes: 1 }).populate('likes');
      if (likes.length) {
        posts[i].likes = likes;
      }
    }

    return ({
      userInformation,
      connections,
      interests,
      posts,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.getProfileData = getProfileData;

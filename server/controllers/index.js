const bcrypt = require('bcrypt');
const { generateAccessToken } = require('../services/auth.js');
const { createAndPushPost } = require('../services/publishPost.js');
const { getHomePagePosts } = require('../services/homePage.js');
const { getSinglePost } = require('../services/getSinglePost.js');
const { getLikeStatus, updateLike } = require('../services/like.js');
const { addComment } = require('../services/comment.js');
const { getProfileData } = require('../services/profile.js');
const { searchUserProfiles, searchInterestEntries } = require('../services/search.js');
const { GmailMailer } = require('../services/gmailAuth.js');
const { HTMLResetPasswordForm } = require('../services/template.js');
const { InsertValidationDocument } = require('../services/resetHash.js');
const { VerifyResetPasswordHash } = require('../services/verifyResetHash.js');
const { changePasswordForUser } = require('../services/changePassword.js');
const { checkForFirstLogin } = require('../services/firstLogin.js');
const { postUserInformationForBio } = require('../services/postFirstLogin.js');
const { changePasswordInSettings } = require('../services/settingsChangePassword.js');
const { postUserCredentialsInDatabase } = require('../services/register.js');
const mysql = (require('../db/mysql/connection.js'));

module.exports.getHomePage = async (req, res) => {
  try {
    const posts = await getHomePagePosts();
    return res.json(posts);
  } catch (error) {
    return res.status(404).json({ msg: error.message });
  }
};

module.exports.getUserFeed = async (req, res) => {
  try {
    const status = await checkForFirstLogin(req.userHandle);
    return res.json(status);
  } catch {
    return res.status(500).json({ msg: `Unable to check first login for @${req.userHandle}dot!` });
  }
};

module.exports.getUserProfile = async (req, res) => {
  try {
    const userID = req.params.handle;
    const data = await getProfileData(userID, req.userHandle);
    res.json({ msg: `UserID to be queried: ${userID}`, data });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports.publishPost = async (req, res) => {
  try {
    await createAndPushPost(req.body, req.userHandle);
    return res.json({ msg: 'Post posted successfully!' });
  } catch (error) {
    return res.status(400).json({ msg: error.message });
  }
};

module.exports.getPost = async (req, res) => {
  try {
    const postID = req.params.id;
    const data = await getSinglePost(postID);
    res.json({ msg: `postID to be queried: ${postID}`, data });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports.newComment = async (req, res) => {
  try {
    const postID = req.params.id;
    const status = await addComment(postID, req.userHandle, req.body.Comment);
    res.json({ msg: `Comment status of postID ${postID}`, status });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports.getLike = async (req, res) => {
  try {
    const postID = req.params.id;
    const status = await getLikeStatus(postID, req.userHandle);
    res.json({ msg: `Get like status of postID ${postID}`, status });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports.addLike = async (req, res) => {
  try {
    const postID = req.params.id;
    const status = await updateLike(postID, req.userHandle);
    res.json({ msg: 'Like updated successfully', status });
  } catch (error) {
    res.status(404).json({ msg: error.message });
  }
};

module.exports.searchInterest = async (req, res) => {
  try {
    const { topic } = req.query;
    const entries = await searchInterestEntries(topic);
    return res.status(200).json({ msg: `Post topic to be queried: ${topic}`, entries });
  } catch (error) {
    return res.status(500).json({ msg: `Error occurred while searching for interests, ${error.message}` });
  }
};

module.exports.searchUser = async (req, res) => {
  try {
    const { handle } = req.query;
    const users = await searchUserProfiles(handle);
    return res.status(200).json({ msg: `Handle to be queried: ${handle}`, users });
  } catch (error) {
    return res.status(500).json({ msg: `Error occurred while searching for users, ${error.message}` });
  }
};

module.exports.getSettings = async (req, res) => {
  try {
    const _query = `select Username, Email,
    Handle from TERRABUZZ.UserInformation where Handle='${req.userHandle}';`;
    const output = await mysql.connection.query(_query);
    res.send(output);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports.updateSettings = async (req, res) => {
  if (req.body.Password === req.body.CPassword) {
    const passwordQuery = `select Password from TERRABUZZ.UserInformation where Handle='${req.userHandle}';`;
    const [queryPassword] = await mysql.connection.query(passwordQuery);
    const [data] = queryPassword;

    if (data.Password === req.body.Password) {
      const updateQuery = `UPDATE TERRABUZZ.UserInformation 
                    SET Email = '${req.body.Email}', Username = '${req.body.Username}'
                    WHERE Handle='${req.userHandle}';`;
      await mysql.connection.query(updateQuery);
      return res.status(200).json({ msg: 'Updated' });
    }

    return res.status(401).json({ msg: 'Bad Request' });
  }

  return res.status(401).json({ msg: 'Bad Request' });
};

module.exports.changePassword = async (req, res) => {
  try {
    await changePasswordInSettings(req.userHandle, req.body.oldPassword,
      req.body.newPassword, req.body.confirmPassword);
    return res.status(200).json({ msg: 'Password changed succesfully!' });
  } catch (error) {
    return res.status(500).json({ msg: `Unable to update password, due to ${error.message}` });
  }
};

module.exports.loginUser = async (req, res) => {
  try {
    const token = await generateAccessToken(req.body);
    res.cookie('access-token', token, { httpOnly: true, sameSite: true });
    return res.status(200).json({ msg: 'User logged in!!' });
  } catch (error) {
    return res.status(401).json({ msg: error.message });
  }
};

module.exports.registerUser = async (req, res) => {
  try {
    const registerForm = {
      password: req.body.password,
      cpassword: req.body.cpassword,
      userhandler: req.body.userhandler,
      username: req.body.username,
      email: req.body.email,
    };
    await postUserCredentialsInDatabase(registerForm);
    return res.status(200).json({ msg: 'Successfully registered user' });
  } catch (error) {
    return res.status(500).json({ msg: `Unable to register user, due to error ${error.message}` });
  }
};

module.exports.newPassword = async (req, res) => {
  try {
    const receivedQueryVerificationHash = req.url.split('/')[2];
    const handle = await VerifyResetPasswordHash(receivedQueryVerificationHash);
    return res.status(200).json(handle);
  } catch (error) {
    return res.status(404).json({ msg: `Verification for reset hash not approved, see error, ${error.message}` });
  }
};

module.exports.resetPassword = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const newhashedPassword = await bcrypt.hash(req.body.password, salt);
    await changePasswordForUser(newhashedPassword, req.body.handle);
    return res.status(200).json({ msg: 'Password reset!' });
  } catch (error) {
    return res.status(500).json({ msg: `Error while running changePasswordForUser, with error ${error.message}` });
  }
};

module.exports.forgetPassword = async (req, res) => {
  const __query = `SELECT Handle FROM TERRABUZZ.UserInformation WHERE Email='${req.body.email}'`;

  // If the user exists in the database
  try {
    const [result] = await mysql.connection.query(__query);
    if ([result[0]][0] === undefined) throw new Error('Invalid email!');
  } catch (error) {
    return res.status(404).json({ msg: `equest email to send reset password cannot be found. Error is "${error.message}"` });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    let hashedResetLink = await bcrypt.hash(req.body.email, salt);
    hashedResetLink = hashedResetLink.replaceAll('/', '');
    hashedResetLink = hashedResetLink.replaceAll('.', '');
    try {
      await InsertValidationDocument(req.body.email, hashedResetLink);
    } catch (error) {
      return res.status(500).json({ msg: `InsertValidationDocument failed due to error ${error.message}` });
    }
    const mail = new GmailMailer(req.body.email, HTMLResetPasswordForm(hashedResetLink));
    mail.send();
    return res.status(200).json({ msg: 'Recovery email sent!' });
  } catch (error) {
    return res.status(500).json({ msg: `Unable to send a reset email. Encountered error "${error.message}"` });
  }
};

module.exports.controllerLogOut = async (req, res) => {
  try {
    req.cookie['access-token'] = '';
    return res.status(200).json({ msg: 'Access Token Removed' });
  } catch (error) {
    return res.status(403).json({ msg: 'Unable to remove access token' });
  }
};

module.exports.postFirstLoginInformation = async (req, res) => {
  try {
    await postUserInformationForBio(req.userHandle, req.body.userInformation);
    return res.status(200).json({ msg: 'Succesfully posted first login information' });
  } catch (error) {
    return res.status(500).json({ msg: `Unable to perform insertion, due to error "${error.message}"` });
  }
};

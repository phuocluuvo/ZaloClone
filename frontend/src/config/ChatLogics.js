/**
 *
 * @param {User} loggedUser
 * @param {Users} users
 * @returns
 */
export const getSender = (loggedUser, users) => {
  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};
export const getSenderInfo = (loggedUser, users) => {
  console.log(users[0]._id === loggedUser._id ? users[1] : users[0]);
  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
/**
 * @param {Array} messages All of the messages in Chat
 * @param {Message} m the sent message
 * @param {Integer} i the index of the sent message
 * @param {String} userId the loggedUser id
 * @return {Boolean} true if the message is the same sender, false otherwise
 */
export const isSameSender = (messages, m, i, userId) => {
  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    messages[i].sender._id !== userId
  );
};
/**
 * @param {Array} messages All of the messages in Chat
 * @param {Integer} i the index of the message sent
 * @param {String} userId the loggedUser id
 * @return {Boolean} true if the message is the last message, false otherwise
 */
export const isLastMessage = (messages, i, userId) => {
  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender._id !== userId &&
    messages[messages.length - 1].sender._id
  );
};
/**
 * @description Return the "magrin" variable
 * @param {Array} messages All of the messages in Chat
 * @param {Message} m the sent message
 * @param {Integer} i the index of the sent message
 * @param {String} userId the loggedUser id
 * @return {Variable} integer number for margin purposes
 */
export const isSameSenderMargin = (messages, m, i, userId) => {
  if (
    i < messages.length - 1 &&
    messages[i + 1].sender._id === m.sender._id &&
    messages[i].sender._id !== userId
  )
    return 40;
  else if (
    (i < messages.length - 1 &&
      messages[i + 1].sender._id !== m.sender._id &&
      messages[i].sender._id !== userId) ||
    (i === messages.length - 1 && messages[i].sender._id !== userId)
  )
    return 0;
  else return "auto";
};

/**
 * @description Return the "magrin" variable
 * @param {Array} messages All of the messages in Chat
 * @param {Message} m the sent message
 * @param {Integer} i the index of the sent message
 * @param {String} userId the loggedUser id
 * @return {Variable} integer number for margin purposes
 */
export const isSameUserMargin = (messages, m, i, userId) => {
  return i > 0 && messages[i - 1].sender._id === m.sender._id;
};

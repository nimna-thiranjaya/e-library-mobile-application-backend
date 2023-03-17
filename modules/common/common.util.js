const generateFirebaseStorageURL = (fileName) => {
  return `https://firebasestorage.googleapis.com/v0/b/${process.env.FIREBASE_STORAGE_BUCKET}/o/${fileName}?alt=media`;
};

const isEmpty = (obj) => {
  return Object.keys(obj).length === 0;
};

module.exports = {
  generateFirebaseStorageURL,
  isEmpty,
};
